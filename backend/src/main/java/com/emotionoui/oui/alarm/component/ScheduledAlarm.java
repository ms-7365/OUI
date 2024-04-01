package com.emotionoui.oui.alarm.component;

import com.emotionoui.oui.alarm.repository.FcmInfoRepository;
import com.emotionoui.oui.alarm.service.AlarmService;
import com.emotionoui.oui.member.entity.Member;
import com.google.firebase.messaging.FirebaseMessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.List;

@Component
public class ScheduledAlarm {

    @Autowired
    private AlarmService alarmService;
    @Autowired
    private FcmInfoRepository fcmInfoRepository;

//    @Scheduled(cron = "0 0 22 * * *") // 매일 오후 10시에 실행
    @Scheduled(cron = "0 50 6 * * *")
    public void sendScheduledNotification() throws Exception {

        // 현재 날짜 얻기
        LocalDate currentDate = LocalDate.now();
        // 포맷 지정
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        // 포맷 적용하여 문자열로 변환
        String dateStr = currentDate.format(formatter);
        // 문자열을 Date 객체로 변환
        Date date = java.sql.Date.valueOf(dateStr);
//        Date date2 = java.sql.Date.valueOf("2024-03-01");

        List<String> deviceTokens =fcmInfoRepository.findDeviceTokensWithDataNotExist(date);
        List<Member> members = fcmInfoRepository.findMemberWithDataNotExist(date);

        // 모든 deviceToken 값 출력
        for (String deviceToken : deviceTokens) {
            System.out.println(deviceToken);
        }

        // 알림 전송
        alarmService.sendSystemForcing(dateStr, deviceTokens, members);
    }
}