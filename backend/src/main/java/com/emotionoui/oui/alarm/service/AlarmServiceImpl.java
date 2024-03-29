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
                    .build();
            searchAlarmsResList.add(searchAlarmsRes);
        }

        return searchAlarmsResList;
    }

    @Override
    public void acceptInvite(Member member, Integer diaryId) {
        // memberDiary DB 에 추가해주기(orders, memberId, diaryId)
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
                .build();

        memberDiaryRepository.save(newMemberDiary);

        // memberAlarm DB 에서 삭제
        querydslRepositoryCustom.deleteAlarmByMemberIdAndDiaryId(member, diaryId);
    }

    @Override
    public void refuseInvite(Member member, Integer diaryId) {
        // memberAlarm DB 에서 삭제
        querydslRepositoryCustom.deleteAlarmByMemberIdAndDiaryId(member, diaryId);
    }

//    // 알림 읽음 표시
//    @Override
//    public String readMessage(Long notificationId) {
//        // 해당 알림 SELECT
//        Optional<NotificationEntity> notificationEntityOptional = fcmNotificationRepository.findByNotificationId(notificationId);
//        if (notificationEntityOptional.isPresent()) {
//            NotificationEntity notificationEntity = notificationEntityOptional.get();
//            notificationEntity.setReadStatus(true);
//
//            // 데이터베이스에 변경 내용 저장
//            NotificationEntity dbNotificationEntity = fcmNotificationRepository.save(notificationEntity);
//
//            String URL = "";
//            // 알림 타입 확인
//            if(dbNotificationEntity.getNotificationType() == NotificationType.Chatting){
//                URL =  "/chatRoom";
//            }
//            else{
//                URL =  "/barter/" + notificationEntity.getArticleId();
//            }
//            return URL;
//        }
//        return "";
//    }
//
//    // 알림 제거
//    @Override
//    public Boolean deleteMessage(Long notificationId) {
//        // 알림 유무 확인
//        Optional<NotificationEntity> notificationEntityOptional = fcmNotificationRepository.findByNotificationId(notificationId);
//        if (notificationEntityOptional.isPresent()) {
//            NotificationEntity notificationEntity = notificationEntityOptional.get();
//            notificationEntity.setDeleteStatus(true);
//
//            // 데이터베이스에 변경 내용 저장
//            fcmNotificationRepository.save(notificationEntity);
//            return true;
//        }
//        return false;
//    }
//


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
        // 알림창으로 이동해야 함
        link = "http://localhost:8080/alarm/mainPage";

        List<String> deviceTokens = new ArrayList<>();

        Alarm alarm = Alarm.builder()
                .type(AlarmContentType.Invite)
                .title(title)
                .content(content)
                .build();

        alarmRepository.save(alarm);

        for(String email : emails){
            Member member = memberRepository.findByEmail(email)
                    .orElseThrow(IllegalArgumentException::new);

//            MemberAlarm memberAlarm = MemberAlarm.builder()
//                    .alarm(alarm)
//                    .member(member)
//                    .diary(diary)
//                    .isDeleted(0)
//                    .build();
//
//            memberAlarmRepository.save(memberAlarm);

            // test용
//            deviceTokens.add("eCKbs2zkGtXCXhHZh_KGnb:APA91bF5LuFA_AumHn330BdsSMHafPz8uTWe-Ku3Jgma-VX4HWF7D0rLqIn1TlEUItbphs4wopekhFT2WtRjBfopss74rhvH2CqJbr72G3nxZerwhAc8Hu0JJUVYHdZwH6JwVknQVaTz");
            deviceTokens.add(member.getFcmInfo().getDeviceToken());
        }

        sendMultiMessage(title, content, link, deviceTokens);
    }

    // FriendForcing: 친구가 일기 작성 요청하기(재촉하기)
    public void sendFriendForcing(Integer diaryId, String pusherNickname, Integer memberId, Date date){
        Diary diary = diaryRepository.findById(diaryId)
                .orElseThrow(IllegalArgumentException::new);
        String diaryName = diary.getName();
        String day = date.toString();

        String title, content, link;
        title = "너 오늘 일기 안 써?!";
//        content = "'" + diaryName + "' 다이어리에서 '" + pusherNickname + "'님이 " + day + " 일기 쓰기를 재촉했어요!";
        content = "'" + diaryName + "' 다이어리에서 '" + pusherNickname + "'님이 일기 쓰기를 재촉했어요!";
        // 캘린더로 이동해야 함
        link = "http://localhost:8080/alarm/mainPage";

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

    // FriendDiary: 친구가 일기 작성하면 알려주기
    public void sendFriendDiary(Diary diary, Integer dailyId, Member member){
        String diaryName = diary.getName();

        String title, content, link;
        title = diaryName + " 다이어리";
        content = "'" + member.getNickname() + "' 친구가 일기를 작성했어요~";
        // 일기쓴 곳으로 이동해야 함
        link = "http://localhost:8080/alarm/mainPage";

        List<String> deviceTokens = new ArrayList<>();

        Alarm alarm = Alarm.builder()
                .type(AlarmContentType.FriendDiary)
                .title(title)
                .content(content)
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

    //    // 갈망포카 메세지 전송
//    @Override
//    public Boolean sendBiasMessage(List<String> ids, Long articleId) {
//
//        String title = "갈망포카 출현!";
//        String content = "새로운 갈망포카가 올라 왔어요!! 확인해보세요!!";
//        String link = domain + "/post/" + articleId;
//
//        List<String> deviceTokens = new ArrayList<>();
//        List<String> sendFail = new ArrayList<>();
//        List<Integer> requestError = new ArrayList<>();
//
//        int total = ids.size();
//        for (int i = 0; i < ids.size(); i++){
//            // 유저 정보 가져오기
//            Optional<UserEntity> userEntityOptional = userRepository.findByUserId(ids.get(i));
//            if (userEntityOptional.isPresent()) {
//                UserEntity userEntity = userEntityOptional.get();
//                log.info("user_id : {}", userEntity.getUserId());
//
//                NotificationEntity notificationEntity = NotificationEntity.builder()
//                        .userEntity(userEntity)
//                        .title(title)
//                        .content(content) // 알림 내용
//                        .readStatus(false) // 읽지 않은 상태로 초기화
//                        .notificationType(NotificationType.Article) // 알림 유형 설정, 실제 유형으로 교체 필요
//                        .articleId(articleId) // 관련 글 ID, 필요한 경우 설정
//                        .deleteStatus(false)
//                        .build();
//                // 데이터베이스에 저장
//                fcmNotificationRepository.save(notificationEntity);
//            } else {
//                log.info("User with id {} not found", ids.get(i));
//                continue;
//            }
//
//            // 유저들의 디바이스 정보 가져오기
//            deviceTokens = customFCMNotificationRepository.findDeviceTokensByIds(ids);
//        }
//
//        if(!deviceTokens.isEmpty()) {
//            // 500개 단위로 나누기 - 한번에 처리할 수 있는 메세지 개수는 500개
//            int fullBatches = total / 500;
//            int remaining = total % 500;
//
//            for (int i = 0; i <= fullBatches; i++) {
//                int start = i * 500;
//                int end = Math.min((i + 1) * 500, total);
//
//                List<String> batchTokens = deviceTokens.subList(start, end);
//                log.info("{}번 실행", i);
//                try {
//                    // 메세지 보내기
//                    MulticastMessage message = MulticastMessage.builder()
//                            .addAllTokens(batchTokens)
//                            .putData("title", title)
//                            .putData("content", content)
//                            .putData("link", link)
//                            .build();
//                    BatchResponse response = FirebaseMessaging.getInstance().sendMulticast(message);
//                    log.info(response.getSuccessCount() + " messages were sent successfully.");
//
//                    // 실패한 토큰 수
//                    if (response.getFailureCount() > 0) {
//                        List<SendResponse> responses = response.getResponses();
//                        for (SendResponse respons : responses) {
//                            if (!respons.isSuccessful()) {
//                                // The order of responses corresponds to the order of the registration tokens.
//                                sendFail.add(batchTokens.get(i));
//                            }
//                        }
//                    }
//                } catch (Exception e) {
//                    log.info("request error");
//                    requestError.add(i);
//                }
//            }
//            // 실패한 요청에 대한 재요청
//            if (!sendFail.isEmpty()) {
//                fullBatches = sendFail.size() / 500;
//                for(int i = 0; i <= fullBatches; i++) {
//                    int start = i * 500;
//                    int end = Math.min((i + 1) * 500, total);
//
//                    List<String> batchTokens = sendFail.subList(start, end);
//                    try {
//                        // 메세지 보내기
//                        MulticastMessage message = MulticastMessage.builder()
//                                .addAllTokens(batchTokens)
//                                .putData("title", title)
//                                .putData("content", content)
//                                .putData("link", link)
//                                .build();
//
//                        BatchResponse response = FirebaseMessaging.getInstance().sendMulticast(message);
//                        log.info(response.getSuccessCount() + " messages were sent successfully.");
//
//                        // 실패한 토큰 수
//                        if (response.getFailureCount() > 0) {
//                            List<SendResponse> responses = response.getResponses();
//                            for (int j = 0; j < responses.size(); j++) {
//                                if (!responses.get(j).isSuccessful()) {
//                                    // The order of responses corresponds to the order of the registration tokens.
//                                    sendFail.add(batchTokens.get(i));
//                                }
//                            }
//                        }
//                    } catch (Exception e) {
//                        log.info("request error");
//                        requestError.add(i);
//                    }
//                }
//            }
//            return true;
//        }
//        return false;
//    }
//
////    public List<String> findDeviceTokensByIds(List<String> ids) {
////        TypedQuery<String> query = entityManager.createQuery(
////                "SELECT ud.deviceToken FROM UserDeviceEntity ud WHERE ud.userId IN :ids", String.class);
////        query.setParameter("ids", ids);
////        return query.getResultList();
////    }
//
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