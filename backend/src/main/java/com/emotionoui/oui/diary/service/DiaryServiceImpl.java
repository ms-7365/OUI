package com.emotionoui.oui.diary.service;

import com.emotionoui.oui.alarm.service.AlarmService;
import com.emotionoui.oui.calendar.entity.Emotion;
import com.emotionoui.oui.calendar.repository.EmotionRepository;
import com.emotionoui.oui.diary.dto.EmotionClass;
import com.emotionoui.oui.diary.dto.req.CreateDailyDiaryReq;
import com.emotionoui.oui.diary.dto.req.DecorateDailyDiaryReq;
import com.emotionoui.oui.diary.dto.req.UpdateDailyDiaryReq;
import com.emotionoui.oui.diary.dto.req.UpdateDiarySettingReq;
import com.emotionoui.oui.diary.dto.res.DecorateDailyDiaryRes;
import com.emotionoui.oui.diary.dto.res.SearchDailyDiaryRes;
import com.emotionoui.oui.diary.dto.res.SearchDiarySettingRes;
import com.emotionoui.oui.diary.entity.DailyDiary;
import com.emotionoui.oui.diary.entity.DailyDiaryCollection;
import com.emotionoui.oui.diary.entity.Diary;
import com.emotionoui.oui.diary.entity.DiaryType;
import com.emotionoui.oui.diary.exception.NotExitPrivateDiaryException;
import com.emotionoui.oui.diary.exception.NotFoundPrivateDiaryException;
import com.emotionoui.oui.music.entity.MusicCollection;
import com.emotionoui.oui.diary.repository.DailyDiaryMongoRepository;
import com.emotionoui.oui.diary.repository.DailyDiaryRepository;
import com.emotionoui.oui.diary.repository.DiaryRepository;
import com.emotionoui.oui.music.repository.MusicMongoRepository;
import com.emotionoui.oui.member.entity.AlarmType;
import com.emotionoui.oui.member.entity.Member;
import com.emotionoui.oui.member.entity.MemberDiary;
import com.emotionoui.oui.member.repository.MemberDiaryRepository;
import com.emotionoui.oui.music.service.MusicService;
import com.emotionoui.oui.openai.service.CustomBotService;
import com.emotionoui.oui.querydsl.QuerydslRepositoryCustom;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class DiaryServiceImpl implements DiaryService{

    private final DailyDiaryMongoRepository dailyDiaryMongoRepository;
    private final DailyDiaryRepository dailyDiaryRepository;
    private final DiaryRepository diaryRepository;
    private final EmotionRepository emotionRepository;
    private final MusicMongoRepository musicMongoRepository;
    private final MemberDiaryRepository memberDiaryRepository;
    private final MusicService musicService;
    private final AlarmService alarmService;
    private final CustomBotService customBotService;
    private final QuerydslRepositoryCustom querydslRepositoryCustom;


    // 일기 생성하기
    public String createDailyDiary(CreateDailyDiaryReq req, Member member) throws IOException, ExecutionException, InterruptedException {
        
        // MongoDB에 넣을 entity 생성
        DailyDiaryCollection dailyDiaryCollection = DailyDiaryCollection.builder()
                .diaryId(req.getDiaryId())
                .memberId(member.getMemberId())
                .content(req.getDailyContent())
                .isDeleted(0)
                .nickname(member.getNickname())
                .build();

        // MongoDB에 dailyDiary 정보 저장
        DailyDiaryCollection document = dailyDiaryMongoRepository.insert(dailyDiaryCollection);

        // diaryId로 diary 정보 가져오기
        Diary diary = diaryRepository.findById(req.getDiaryId())
                .orElseThrow(IllegalArgumentException::new);

        // MariaDB에 넣을 entity 생성
        DailyDiary dailyDiary = DailyDiary.builder()
                .diary(diary)
                .mongoId(document.getId().toString())
                .dailyDate(req.getDailyDate())
                .build();

        // MariaDB에 dailyDiary 정보(몽고디비ID 포함) 저장
        DailyDiary newDailyDiary = dailyDiaryRepository.save(dailyDiary);
        Date dailyDate = req.getDailyDate();

        String text = null;

        try {
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode jsonNode = objectMapper.readTree(req.getDailyContent());

            // objects[0].text 안에 있는 텍스트 파일내용 추출
            text = jsonNode.get("objects").get(0).get("text").asText();
            // 텍스트 내용이 존재하면 AI 서버로 분석 요청하기
            if(!Objects.equals(text, "")){
                // 비동기 처리
                String finalText = text;

                // 1) ChatGPT로 코멘트 기능
                CompletableFuture<Void> future1 = CompletableFuture.runAsync(() ->
                        gptComment(finalText, document));

                // 2) 감정분석 후 노래 추천 기능
                CompletableFuture<Void> future2 = CompletableFuture.runAsync(() -> {
                    try {
                        sendDataToAI(finalText, dailyDate, document, dailyDiary, member);
                    } catch (ExecutionException e) {
                        throw new RuntimeException(e);
                    } catch (InterruptedException e) {
                        throw new RuntimeException(e);
                    }
                });

//                String musicString = sendDataToAI(text, dailyDate, document, dailyDiary, member);
//                List<String> spotifyUriList = findSpotifyUri(musicString);
//                document.setMusic(spotifyUriList);
//                dailyDiaryMongoRepository.save(document);
            }

        } catch (Exception e){
            e.printStackTrace();
            log.info("텍스트 파일 위치를 찾을 수 없습니다.");
        }

        // 공유 다이어리일 시 친구들에게 본인 일기 알람 전송
        alarmService.sendFriendDiary(diary, newDailyDiary.getId(), member);
        return document.getId().toString();
    }

    // ChatGPT 코멘트 값 받아서 몽고디비에 저장하기
    private void gptComment(String text, DailyDiaryCollection document){
        String gptResponse = customBotService.chat(text);
        document.setComment(gptResponse);
        dailyDiaryMongoRepository.save(document);
    }

    // musicIdList를 가지고 spotifyUriList를 만들기
    private List<String> findSpotifyUri(String musicString){
        // JsonString 파일을 List<Integer> 리스트로 만들기
        List<Integer> musicIdList = new ArrayList<>();
        String[] musicIds = musicString.split(",");
        for(String musicId : musicIds){
            musicIdList.add(Integer.parseInt(musicId.trim()));
        }

        List<String> list = new ArrayList<>();

//        // 할당받은 musicId를 기반으로 MongoDB에 있는 MUSIC document(musicInfo) 찾기
//        for(int i=0; i<musicIdList.size(); ++i){
//            int musicId = musicIdList.get(i);
//            MusicCollection musicCollection = musicMongoRepository.findByMusicId(musicId);
//            String artistName = musicCollection.getArtistName().get(0);
//            String songName = musicCollection.getSongName();
//            // spotify URI이 존재하지 않으면
//            if(musicCollection.getSpotifyUrl()==null){
//                // searchMusicURI 함수를 통해 spotify URI를 찾음
//                String uri = musicService.searchMusicURI(artistName, songName);
//                if(uri!=null) {
//                    list.add(uri);
//                    // MongoDB에 있는 기존 MUSIC Document에도 반영
//                    musicCollection.setSpotifyUrl(uri);
//                    musicMongoRepository.save(musicCollection);
//                }
//            }else{
//                list.add(musicCollection.getSpotifyUrl());
//            }
//        }
        
        return list;
    }

    // AI를 통한 감정분석 및 음악추천 결과값 받기
    public void sendDataToAI(String text, Date dailyDate, DailyDiaryCollection document, DailyDiary dailyDiary, Member member) throws ExecutionException, InterruptedException {
        // 감정분석 AI Url
        String aiServerUrl = "http://j10a506.p.ssafy.io:8008/analysis/openvino";
        String aiServerUrl2 = "http://ai-server-2/process-data";

        // CompletableFuture를 사용하여 감정분석 요청을 보내고 데이터 받기
        // supplyAsync: 비동기 + 반환값이 있는 경우
        // runAsync: 비동기 + 반환값이 없는 경우
        CompletableFuture<String> future = CompletableFuture.supplyAsync(() -> {
            // 텍스트 내용 보내고 감정분석 결과 받기
            log.info("sendTextData 전까지 왔나요?");
            return sendTextData(text, aiServerUrl);
        }).thenApply(s -> {
            // thenApply: 반환 값을 받아서 다른 값을 반환함
            // thenAccept: 반환 값을 받아 처리하고 값읋 반환하지 않음
            // thenRun: 반환 값을 받지 않고 다른 작업을 실행함
            ObjectMapper objectMapper = new ObjectMapper();
            try {
                // 감정분석 결과를 MongoDB에 넣기
                log.info("emotionRes 까지 왔나요?");
                EmotionClass emotionRes = objectMapper.readValue(s, EmotionClass.class);

                document.setEmotion(emotionRes);
                dailyDiaryMongoRepository.save(document);

                // MariaDB에 대표감정(Emotion) 정보 저장
                Emotion emotion = Emotion.builder()
                        .dailyDiary(dailyDiary)
                        .emotion(emotionRes.getEmotionList().get(0))
                        .date(dailyDate)
                        .member(member)
                        .build();

                emotionRepository.save(emotion);

            } catch (JsonProcessingException e) {
                throw new RuntimeException(e);
            }
            // 실험실험
            return null;
            // 감정분석 보내고 음악추천 결과 받기
            // return sendEmotionData(s, aiServerUrl2);
        });

//        return future.get();
    }

    // 감정처리를 위한 요청을 보내고 감정분석 결과를 받는 메서드
    private static String sendTextData(String text, String aiServerUrl) {
        
        log.info("sendTextData 안에 들어왔어");
        log.info("text : " + text);
        log.info("url : " + aiServerUrl);

        String newText = text.replace("\n","\\n");
        // JSON 형식의 문자열 생성
        String jsonBody = "{\"text\": \"" + newText + "\"}";
        log.info("jsonBody: " + jsonBody);

        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(aiServerUrl))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                .build();

        try {
            HttpResponse<String> emotionData = client.send(request, HttpResponse.BodyHandlers.ofString());
            log.info("emotionData가 나오는 부분: " + emotionData.body());
            return emotionData.body();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    // 음악추천을 위한 요청을 보내고 음악추천 결과를 받는 메서드
    private static String sendEmotionData(String emotionData, String aiServerUrl) {
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(aiServerUrl))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(emotionData))
                .build();

        try {
            HttpResponse<String> musicData = client.send(request, HttpResponse.BodyHandlers.ofString());
            return musicData.body();

        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
    
    // 일기 수정하기
    public Integer updateDailyDiary(UpdateDailyDiaryReq req, Integer dailyId){
        DailyDiary dailyDiary = dailyDiaryRepository.findById(dailyId)
                .orElseThrow(IllegalArgumentException::new);

        dailyDiary.updateDailyDate(req.getDailyDate());

        String mongoId = dailyDiary.getMongoId();

        DailyDiaryCollection document = dailyDiaryMongoRepository.findById(mongoId)
                .orElseThrow(IllegalArgumentException::new);

        document.setContent(req.getDailyContent());

        dailyDiaryMongoRepository.save(document);
        return dailyId;
    }

    // 일기 삭제하기
    public void deleteDailyDiary(Integer dailyId){
        DailyDiary dailyDiary = dailyDiaryRepository.findById(dailyId)
                .orElseThrow(IllegalArgumentException::new);
        dailyDiary.updateIsDeleted();

//        DailyDiaryCollection document = dailyDiaryMongoRepository.findById(dailyDiary.getMongoId())
//                .orElseThrow(IllegalArgumentException::new);
//        document.setIsDeleted(1);
//        dailyDiaryMongoRepository.save(document);
    }

    // 일기 조회하기
    public SearchDailyDiaryRes searchDailyDiary(Integer dailyId, Integer memberId){
        DailyDiary dailyDiary = dailyDiaryRepository.findById(dailyId)
                .orElseThrow(IllegalArgumentException::new);

        DailyDiaryCollection dailyDiaryCollection = dailyDiaryMongoRepository.findById(dailyDiary.getMongoId())
                .orElseThrow(IllegalArgumentException::new);

        return SearchDailyDiaryRes.of(dailyDiaryCollection, dailyDiary, memberId);
    }

    // 일기 날짜로 조회하기
    public Boolean searchDailyDiaryByDate(Integer diaryId, String strDate, Integer memberId){

        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
        Date date = null;
        try {
            date = formatter.parse(strDate);
        } catch (ParseException e) {
            throw new RuntimeException(e);
        }

        DailyDiary dailyDiary = dailyDiaryRepository.findByDiaryIdAndDate(diaryId, date);
        if(dailyDiary==null){
            return false;
        }

        System.out.println("dailyDiary Id : " + dailyDiary.getId());

//            DailyDiaryCollection dailyDiaryCollection = dailyDiaryMongoRepository.findById(dailyDiary.getMongoId())
//                    .orElseThrow(IllegalArgumentException::new);

        return true;
    }


    public EmotionClass searchEmotion(Integer dailyId){
        DailyDiary dailyDiary = dailyDiaryRepository.findById(dailyId)
                .orElseThrow(IllegalArgumentException::new);

        return dailyDiaryMongoRepository.findEmotionByDailyId(dailyDiary.getMongoId()).getEmotion();
    }

    public List<String> searchMusic(Integer dailyId){
        DailyDiary dailyDiary = dailyDiaryRepository.findById(dailyId)
                .orElseThrow(IllegalArgumentException::new);

        return dailyDiaryMongoRepository.findMusicByDailyId(dailyDiary.getMongoId()).getMusic();
    }

    public String searchComment(Integer dailyId){
        DailyDiary dailyDiary = dailyDiaryRepository.findById(dailyId)
                .orElseThrow(IllegalArgumentException::new);

        return dailyDiaryMongoRepository.findCommentByDailyId(dailyDiary.getMongoId()).getComment();
    }

    // 다이어리 설정 조회하기
    public SearchDiarySettingRes searchDiarySetting(Integer diaryId, Integer memberId){
        Diary diary = diaryRepository.findById(diaryId)
                .orElseThrow(IllegalArgumentException::new);

        AlarmType alarmStatus = memberDiaryRepository.findAlarmByMemberIdAndDiaryId(diaryId, memberId);

        if(diary.getType().toString().equals("개인")){
            return SearchDiarySettingRes.privateRes(diary, alarmStatus);
        }else{
            List<Member> memberList = memberDiaryRepository.findMemberByDiaryId(diaryId);
            return SearchDiarySettingRes.SharingRes(diary, alarmStatus, memberList);
        }
    }
    
     // 다이어리 설정 수정하기
    public void updateDiarySetting(UpdateDiarySettingReq req, Integer diaryId, Integer memberId){
        Diary diary = diaryRepository.findById(diaryId)
                .orElseThrow(IllegalArgumentException::new);
        diary.updateDiary(req.getName(), req.getTemplateId());

        MemberDiary memberDiary = memberDiaryRepository.findById(memberId)
                .orElseThrow(IllegalArgumentException::new);
        memberDiary.updateAlarm(req.getAlarm());

        if(diary.getType().toString().equals("공유")){
            List<Member> newMemberList = req.getMemberList();
            List<MemberDiary> oldMemberDiaryList = diary.getMemberDiaryList();

            top:
            for(MemberDiary oldMemberDiary : oldMemberDiaryList){
                Member member = oldMemberDiary.getMember();
                for (Member newMember : newMemberList) {
                    if (Objects.equals(member.getMemberId(), newMember.getMemberId())) {
                        continue top;
                    }
                }
                oldMemberDiary.updateIsDeleted();
            }

            for(Member member : newMemberList){
                MemberDiary rep = memberDiaryRepository.findByMemberId(member.getMemberId());
                if(rep==null){
                    MemberDiary newMemberDiary = MemberDiary.builder()
                            .alarm(AlarmType.ON)
                            .orders(memberDiaryRepository.countByMemberId(member.getMemberId())+1)
                            .isDeleted(0)
                            .diary(diary)
                            .member(member)
                            .build();

                    memberDiaryRepository.save(memberDiary);
                }
            }
        }
    }

    // 일기 꾸미기
    public DecorateDailyDiaryRes decorateDailyDiary(DecorateDailyDiaryReq req, Member member){
        DecorateDailyDiaryRes res = DecorateDailyDiaryRes.builder()
                .memberId(member.getMemberId())
                .nickname(member.getNickname())
                .decoration(req.getDecoration())
                .build();

        return res;
    }


    public String decorateSaveDailyDiary(DecorateDailyDiaryReq req, Integer dailyId){

        DailyDiary dailyDiary = dailyDiaryRepository.findById(dailyId)
                .orElseThrow(IllegalArgumentException::new);

        DailyDiaryCollection dailyDiaryCollection = dailyDiaryMongoRepository.findById(dailyDiary.getMongoId())
                .orElseThrow(IllegalArgumentException::new);

        dailyDiaryCollection.setDecoration(req.getDecoration());
        dailyDiaryMongoRepository.save(dailyDiaryCollection);

        return dailyDiaryCollection.getId().toString();
    }

    // 다이어리 나가기
    @Override
    public void exitShareDiary(Integer diaryId, int memberId) {
        // 공유 다이어리인지 확인
        Optional<Diary> diary = diaryRepository.findById(diaryId);
        if(!diary.get().getType().equals(DiaryType.공유)){
            throw new NotExitPrivateDiaryException();
        }
        // 멤버 다이어리 DB에서 삭제처리하기
        querydslRepositoryCustom.exitSharDiaryByMemberIdAndDiaryId(diaryId, memberId);
    }

    // 개인 다이어리 -> 공유 다이어리로 가져오기
    @Override
    public void syncDiary(Integer memberId, Integer diaryId) {
//         memberDiary에서 order가 1이고, memberId가 같은 다이어리 id 찾기(이게 개인일기)
//         dailyDiary에서 해당 다이어리 id이고, 오늘 날짜인 dailyDiary id 찾기
        Integer dailyDiaryId = querydslRepositoryCustom.searchDailyDiaryId(memberId, diaryId);

        if (dailyDiaryId == null) {
            // dailyDiaryId가 null이면 아직 개인일기를 안 쓴 상태이므로 예외 발생
            throw new NotFoundPrivateDiaryException();
        }

//      오늘 일기 찾기
        DailyDiary todayDailyDiary= dailyDiaryRepository.findById(dailyDiaryId).get();
//      dailyDiary DB 에 새로운 행 추가(동기화 할 공유 diaryId)
        DailyDiary newDailyDiary = DailyDiary.builder()
                .dailyDate(todayDailyDiary.getDailyDate())
                .mongoId(todayDailyDiary.getMongoId())
                .diary(diaryRepository.findById(diaryId).get())
                .build();
        dailyDiaryRepository.save(newDailyDiary);
    }
}