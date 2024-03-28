package com.emotionoui.oui.main.controller;

import com.emotionoui.oui.alarm.service.AlarmService;
import com.emotionoui.oui.main.dto.req.ChangeOrderReq;
import com.emotionoui.oui.main.dto.req.CreateShareDiaryReq;
import com.emotionoui.oui.main.dto.res.SearchDiaryListRes;
import com.emotionoui.oui.main.service.MainService;
import com.emotionoui.oui.member.entity.Member;
import com.emotionoui.oui.querydsl.QuerydslRepositoryCustom;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/main")
@RequiredArgsConstructor
public class MainController {

    private final QuerydslRepositoryCustom querydslRepositoryCustom;
    private final MainService mainService;
    private final AlarmService alarmService;
    /**
     * 모든 다이어리 가져오기
     *
     * @param member
     * @return
     */
    @Transactional
    @GetMapping
    public ResponseEntity<List<SearchDiaryListRes>> getDiaries(@AuthenticationPrincipal Member member){
        List<SearchDiaryListRes> memberDiaries = querydslRepositoryCustom.findDiariesByMemberId(member.getMemberId());
        Collections.sort(memberDiaries);
        return ResponseEntity.ok(memberDiaries);
    }

    /**
     * 공유다이어리 생성
     * @param member
     * @return
     */
    @Transactional
    @PostMapping("/diary")
    public ResponseEntity<Void> createShareDiary(@AuthenticationPrincipal Member member, @RequestBody CreateShareDiaryReq createShareDiaryReq){
        int diaryId = mainService.createShareDiary(member, createShareDiaryReq);
        // 초대된 사람들에게 알림 보내기
        alarmService.inviteDiary(createShareDiaryReq.getMembers(), diaryId, member.getNickname());
        return ResponseEntity.ok().build();
    }

    /**
     * 다이어리 순서 바꾸기
     * @param member
     * @param orderList
     * @return
     */
    @Transactional
    @PutMapping("/order")
    public ResponseEntity<Void> changeOrder(@AuthenticationPrincipal Member member, @RequestBody List<ChangeOrderReq> orderList){
        // orderList를 돌며 해당 diary에 해당 newOrder 넣어주기
        mainService.changeOrder(member.getMemberId(), orderList);
        return ResponseEntity.ok().build();
    }
}