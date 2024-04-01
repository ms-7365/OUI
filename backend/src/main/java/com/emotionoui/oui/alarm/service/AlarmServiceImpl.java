package com.emotionoui.oui.alarm.service;

import com.emotionoui.oui.alarm.domain.AlarmMessage;
import com.emotionoui.oui.alarm.dto.req.AlarmTestReq;
import com.emotionoui.oui.alarm.dto.res.SearchAlarmsRes;
import com.emotionoui.oui.alarm.entity.Alarm;
import com.emotionoui.oui.alarm.entity.AlarmContentType;
import com.emotionoui.oui.alarm.entity.FcmInfo;
import com.emotionoui.oui.alarm.exception.AlreadyCandidateException;
import com.emotionoui.oui.alarm.repository.AlarmRepository;
import com.emotionoui.oui.alarm.repository.FcmInfoRepository;
import com.emotionoui.oui.diary.entity.Diary;
import com.emotionoui.oui.diary.repository.DiaryRepository;
import com.emotionoui.oui.member.entity.AlarmType;
import com.emotionoui.oui.member.entity.Member;
import com.emotionoui.oui.member.entity.MemberAlarm;
import com.emotionoui.oui.member.entity.MemberDiary;
import com.emotionoui.oui.member.repository.MemberAlarmRepository;
import com.emotionoui.oui.member.repository.MemberDiaryRepository;
import com.emotionoui.oui.member.repository.MemberRepository;
import com.emotionoui.oui.querydsl.QuerydslRepositoryCustom;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.messaging.BatchResponse;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.MulticastMessage;
import com.google.firebase.messaging.SendResponse;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import okhttp3.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class AlarmServiceImpl implements AlarmService{

    private final AlarmRepository alarmRepository;
    private final MemberAlarmRepository memberAlarmRepository;
    private final FcmInfoRepository fcmInfoRepository;
    private final MemberRepository memberRepository;
    private final DiaryRepository diaryRepository;
    private final QuerydslRepositoryCustom querydslRepositoryCustom;
    private final MemberDiaryRepository memberDiaryRepository;

    @Value("http://localhost:8080")
    String domain;

    @Value("https://fcm.googleapis.com/v1/projects/project-oui/messages:send")
    String API_URL;

//    @PersistenceContext
//    private EntityManager entityManager;

    private final ObjectMapper objectMapper;

    // 알림 리스트 보내기
    public List<SearchAlarmsRes> searchAlarmList(Integer memberId) {
        List<MemberAlarm> memberAlarms = memberAlarmRepository.findByMemberId(memberId);
        List<SearchAlarmsRes> searchAlarmsResList = new ArrayList<>();

        for (MemberAlarm memberAlarm : memberAlarms) {
            Alarm alarm = memberAlarm.getAlarm();
            SearchAlarmsRes searchAlarmsRes = SearchAlarmsRes.builder()
                    .alarmId(alarm.getId())
                    .alarmContentType(alarm.getType())
                    .title(alarm.getTitle())
                    .content(alarm.getContent())
                    .diaryId(memberAlarm.getDiary().getId())
                    .link(alarm.getLink())
                    .build();
            searchAlarmsResList.add(searchAlarmsRes);
        }

        return searchAlarmsResList;
    }

    // 알림 전체 삭제하기
    public void deleteAlarms(Integer memberId){
        List<MemberAlarm> memberAlarms = memberAlarmRepository.findByMemberId(memberId);

        for (MemberAlarm memberAlarm : memberAlarms)
            memberAlarm.updateIsDeleted(1);
    }

    @Override
    public void acceptInvite(Member member, Integer diaryId) {
        // memberDiary DB에 추가해주기(orders, memberId, diaryId)
        // memberDiary DB에서 memberId이고, isDeleted=0인 것을 찾아서 orders를 구하자
        Long order = querydslRepositoryCustom.findDiaryOrder(member)+1;
        // memberDiary DB에 추가하자
        Diary newDiary = diaryRepository.findById(diaryId).get();

        // memberDiary DB에 member, diary, isDeleted=0 인 것이 이미 있다면(이미 해당 공유다이어리에 참여중이라면) 예외처리
        Integer checkDiary = querydslRepositoryCustom.checkDiary(member, diaryId);
        if (checkDiary != null) {
            throw new AlreadyCandidateException();
        }

        MemberDiary newMemberDiary = MemberDiary.builder()
                .member(member)
                .diary(newDiary)
                .orders(order.intValue())
                .alarm(AlarmType.ON)
                .build();

        memberDiaryRepository.save(newMemberDiary);

        // memberAlarm DB 에서 삭제
        querydslRepositoryCustom.deleteAlarmByMemberIdAndDiaryId(member, diaryId);
    }

    @Override
    public void refuseInvite(Member member, Integer diaryId) {
        // memberAlarm DB에서 삭제
        querydslRepositoryCustom.deleteAlarmByMemberIdAndDiaryId(member, diaryId);
    }

    @Override
    public void readAlarm(Member member, Integer alarmId) {
        Optional<MemberAlarm> getAlarm = memberAlarmRepository.findMemberAlarmByMemberAndAlarm_Id(member,alarmId);
        if(getAlarm.isPresent()){
            MemberAlarm alarm = getAlarm.get();
            alarm.setIsDeleted(1);
            memberAlarmRepository.save(alarm);
        }
    }

    // Invite: 공유다이어리 초대 알림 보내기
    public void inviteDiary(List<String> emails, Integer diaryId, String createrNickname){
        Diary diary = diaryRepository.findById(diaryId)
                .orElseThrow(IllegalArgumentException::new);
        String diaryName = diary.getName();

        // emails = null일 경우 처리
        if(emails.isEmpty()){
            throw new IllegalArgumentException("Emails is empty");
        }

        String title, content, link;
        title = "공유 다이어리 초대";
        content = "'" + createrNickname + "'님이 '" + diaryName + "' 다이어리에 초대했어요.";
        // 알림창이 있는 메인페이지로 이동
        link = "http://localhost:3000/main";

        List<String> deviceTokens = new ArrayList<>();

        Alarm alarm = Alarm.builder()
                .type(AlarmContentType.Invite)
                .title(title)
                .content(content)
                .link(link)
                .build();

        alarmRepository.save(alarm);

        for(String email : emails){
            Member member = memberRepository.findByEmail(email)
                    .orElseThrow(IllegalArgumentException::new);

            MemberAlarm memberAlarm = MemberAlarm.builder()
                    .alarm(alarm)
                    .member(member)
                    .diary(diary)
                    .isDeleted(0)
                    .build();

            memberAlarmRepository.save(memberAlarm);

            // test용
//            deviceTokens.add("eCKbs2zkGtXCXhHZh_KGnb:APA91bF5LuFA_AumHn330BdsSMHafPz8uTWe-Ku3Jgma-VX4HWF7D0rLqIn1TlEUItbphs4wopekhFT2WtRjBfopss74rhvH2CqJbr72G3nxZerwhAc8Hu0JJUVYHdZwH6JwVknQVaTz");
            deviceTokens.add(member.getFcmInfo().getDeviceToken());
        }

        sendMultiMessage(title, content, link, deviceTokens);
    }

    // FriendForcing: 친구가 일기 작성 요청하기(재촉하기)
    public void sendFriendForcing(Integer diaryId, String pusherNickname, Integer memberId, String date){
        Diary diary = diaryRepository.findById(diaryId)
                .orElseThrow(IllegalArgumentException::new);
        String diaryName = diary.getName();
        String[] dateSplit = date.split("-");
        // 월과 일에 어색하게 0이 들어가는 부분 삭제
        dateSplit[1] = dateSplit[1].replace("0", "");
        if(dateSplit[2].charAt(0)=='0')
            dateSplit[2] = dateSplit[2].replace("0", "");

        String title, content, link;
        title = "너 오늘 일기 안 써?!";
        content = "'" + diaryName + "' 다이어리에서 '" + pusherNickname + "'님이 " + dateSplit[1] + "월 " + dateSplit[2] + "일 일기 쓰기를 재촉했어요!";
        // 캘린더로 이동
        link = "http://localhost:3000/calendar/" + diaryId;

        Alarm alarm = Alarm.builder()
                .type(AlarmContentType.FriendForcing)
                .title(title)
                .content(content)
                .build();

        Alarm newAlarm = alarmRepository.save(alarm);

        Member member = memberRepository.findById(memberId)
                .orElseThrow(IllegalArgumentException::new);

        MemberAlarm memberAlarm = MemberAlarm.builder()
                .alarm(newAlarm)
                .member(member)
                .diary(diary)
                .isDeleted(0)
                .build();
        memberAlarmRepository.save(memberAlarm);

        FcmInfo info = fcmInfoRepository.findByMember(member);

        if(info.getDeviceToken()!=null){
            try{
                // 메세지 보내기
                String message = makeMessage(
                        info.getDeviceToken(), title, content, link
                );
                System.out.println("message: " + message);
                sendMessage(message);
            } catch (Exception e){
                log.info("request error");
            }
        } else {
            log.info(member.getNickname() + "의 UserDeviceToken이 존재하지 않습니다.");
        }
    }

    // SystemForcing: 오후 10시에 오늘 일기를 아예 안 쓴 사람에게 메시지 보내기
    public void sendSystemForcing(Member member, String date){

    }

    
    // FriendDiary: 친구가 일기 작성하면 알려주기
    public void sendFriendDiary(Diary diary, Integer dailyId, Member member){
        String diaryName = diary.getName();

        String title, content, link;
        title = diaryName + " 다이어리";
        content = "'" + member.getNickname() + "' 친구가 일기를 작성했어요~";
        // 일기 작성 페이지로 이동
        link = "http://localhost:3000/diary/" + dailyId;

        List<String> deviceTokens = new ArrayList<>();

        Alarm alarm = Alarm.builder()
                .type(AlarmContentType.FriendDiary)
                .title(title)
                .content(content)
                .link(link)
                .build();

        alarmRepository.save(alarm);

        List<MemberDiary> memberDiaries = diary.getMemberDiaryList();

        for(MemberDiary memberDiary : memberDiaries){
            Member friend = memberDiary.getMember();

            if(Objects.equals(friend.getMemberId(), member.getMemberId()))
                continue;

            MemberAlarm memberAlarm = MemberAlarm.builder()
                    .alarm(alarm)
                    .member(friend)
                    .diary(diary)
                    .isDeleted(0)
                    .build();

            memberAlarmRepository.save(memberAlarm);

            deviceTokens.add(friend.getFcmInfo().getDeviceToken());
        }

        sendMultiMessage(title, content, link, deviceTokens);
    }

    // 단체 메시지 보내기
    private void sendMultiMessage(String title, String content, String link, List<String> deviceTokens) {
        if(!deviceTokens.isEmpty()) {
            List<String> sendFail = new ArrayList<>();
            try {
                log.info(deviceTokens.get(0));
                // 메세지 보내기
                MulticastMessage message = MulticastMessage.builder()
                        .addAllTokens(deviceTokens)
                        .putData("title", title)
                        .putData("body", content)
                        .putData("link", link)
                        .build();
                BatchResponse response = FirebaseMessaging.getInstance().sendMulticast(message);

                // 실패한 토큰 수
                if (response.getFailureCount() > 0) {
                    List<SendResponse> responses = response.getResponses();
                    for (SendResponse respons : responses) {
                        if (!respons.isSuccessful()) {
                            // The order of responses corresponds to the order of the registration tokens.
                            sendFail.add(deviceTokens.get(responses.indexOf(respons)));
                        }
                    }
                }
            } catch (Exception e) {
                log.info("request error");
            }

            // 실패한 요청에 대한 재요청
            if (!sendFail.isEmpty()) {
                try {
                    // 메세지 보내기
                    MulticastMessage message = MulticastMessage.builder()
                            .addAllTokens(sendFail)
                            .putData("title", title)
                            .putData("body", content)
                            .putData("link", link)
                            .build();
                    BatchResponse response = FirebaseMessaging.getInstance().sendMulticast(message);

                    // 실패한 토큰 수
                    List<SendResponse> responses = response.getResponses();
                    for (SendResponse respons : responses) {
                        if (!respons.isSuccessful()) {
                            sendFail.add(sendFail.get(responses.indexOf(respons)));
                        }
                    }

                    for(int i=0; i<responses.size(); ++i){
                        sendFail.remove(0);
                    }

                } catch (Exception e) {
                    log.info("request error");
                }
            }
        }
    }

    public void createDeviceToken(Member member, String deviceToken){
        FcmInfo fcmInfo = fcmInfoRepository.findByMember(member);

        if(fcmInfo!=null){
            fcmInfo.updateDeviceToken(deviceToken);
        }
        else{
            FcmInfo info = FcmInfo.builder()
                    .member(member)
                    .deviceToken(deviceToken)
                    .build();

            fcmInfoRepository.save(info);
        }
    }

    // 메세지 보내기 테스트용
    @Override
    public void sendMessageTo(AlarmTestReq alarmTestReq) throws IOException {

        String message = makeMessage(
                alarmTestReq.getTargetToken(), alarmTestReq.getTitle(),
                alarmTestReq.getBody(), alarmTestReq.getLink()
        );

        log.info(message);

        OkHttpClient client = new OkHttpClient();
        RequestBody requestBody = RequestBody.create(message,
                MediaType.get("application/json; charset=utf-8"));
        Request request = new Request.Builder()
                .url(API_URL)
                .post(requestBody)
                .addHeader(HttpHeaders.AUTHORIZATION, "Bearer " + getAccessToken())
                .addHeader(HttpHeaders.CONTENT_TYPE, "application/json; UTF-8")
                .build();

        Response response = client.newCall(request).execute();

        System.out.println("무슨값이 찍히는거야: " + response.body().string());
    }

    // 채팅 알림 메세지 만들기
    private String makeMessage(String targetToken, String title, String body, String link) throws JsonProcessingException {
        AlarmMessage alarmMessage = AlarmMessage.builder()
                .message(AlarmMessage.Message.builder()
                        .token(targetToken)
                        .data(Map.of(
                                "title", title,
                                "body", body,
                                "link", link
                                // "image", "이미지_URL" // 이미지 URL을 추가할 경우
                        ))
                        .build())
                .validateOnly(false)
                .build();
        return objectMapper.writeValueAsString(alarmMessage);
    }

    // 알림 메세지 보내기
    private void sendMessage(String message) throws Exception{
        OkHttpClient client = new OkHttpClient();
        RequestBody requestBody = RequestBody.create(message,
                MediaType.get("application/json; charset=utf-8"));

        Request request = new Request.Builder()
                .url(API_URL)
                .post(requestBody)
                .addHeader(HttpHeaders.AUTHORIZATION, "Bearer " + getAccessToken())
                .addHeader(HttpHeaders.CONTENT_TYPE, "application/json; UTF-8")
                .build();
        Response response = client.newCall(request).execute();
        System.out.println(response.body().string());
    }

    // 토큰 받아오기
    private String getAccessToken() throws IOException {
        String firebaseConfigPath = "env/firebase_service_key.json";

        GoogleCredentials googleCredentials = GoogleCredentials
                .fromStream(new ClassPathResource(firebaseConfigPath).getInputStream())
                .createScoped(List.of("https://www.googleapis.com/auth/cloud-platform"));

        googleCredentials.refreshIfExpired();
        return googleCredentials.getAccessToken().getTokenValue();
    }
}