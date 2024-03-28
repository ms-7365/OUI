package com.emotionoui.oui.alarm.controller;


import com.emotionoui.oui.alarm.dto.TestDto;
import com.emotionoui.oui.alarm.dto.req.AlarmTestReq;
import com.emotionoui.oui.alarm.dto.res.SearchAlarmsRes;
import com.emotionoui.oui.alarm.service.AlarmService;
import com.emotionoui.oui.member.entity.Member;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Slf4j
@Controller
@RequiredArgsConstructor
@RequestMapping("/alarm")
public class AlarmController {

    private final AlarmService alarmService;

    @GetMapping
    // 전체 알림리스트 가져오기
    public ResponseEntity<?> searchAlarms(@AuthenticationPrincipal Member member){
        int memberId = member.getMemberId();
        List<SearchAlarmsRes> alarms = alarmService.searchAlarmList(memberId);

        return new ResponseEntity<List<SearchAlarmsRes>>(alarms, HttpStatus.OK);
    }

    // 알림 보내기 테스트용(단일 알림)
    @PostMapping("/fcm")
    public ResponseEntity<?> pushMessage(@RequestBody AlarmTestReq alarmTestReq) throws IOException {
        log.info("requestDTO : {}, {}, {}", alarmTestReq.getTargetToken(),alarmTestReq.getTitle(), alarmTestReq.getBody());

        alarmService.sendMessageTo(alarmTestReq);
        return ResponseEntity.ok().build();
    }

    // 초대알림 보내기(포스트 맨용)
    @PostMapping("/invite")
    public ResponseEntity<?> postChatNotification(@RequestBody TestDto testDto) {
        alarmService.inviteDiary(testDto.getMembers(), testDto.getDiaryId(), testDto.getCreaterNickname());
        return new ResponseEntity<>(HttpStatus.OK);
    }

    // 기기 코드 등록하기
    @PostMapping("/device")
    public ResponseEntity<?> createDevice(@RequestBody Map<String, String> deviceToken,
                                          @AuthenticationPrincipal Member member) throws IOException {
        log.info("deviceToken : {}", deviceToken.get("deviceToken"));
        alarmService.createDeviceToken(member, deviceToken.get("deviceToken"));
        return new ResponseEntity<>(HttpStatus.OK);
    }

    // 실험용
    @GetMapping("/mainPage")
    public String mainPage(){
        return "mainPage";
    }
}
