package com.emotionoui.oui.diary.controller;

import com.emotionoui.oui.diary.dto.EmotionClass;
import com.emotionoui.oui.diary.dto.req.CreateDailyDiaryReq;
import com.emotionoui.oui.diary.dto.req.DecorateDailyDiaryReq;
import com.emotionoui.oui.diary.dto.req.UpdateDailyDiaryReq;
import com.emotionoui.oui.diary.dto.req.UpdateDiarySettingReq;
import com.emotionoui.oui.diary.dto.res.DecorateDailyDiaryRes;
import com.emotionoui.oui.diary.dto.res.SearchDailyDiaryRes;
import com.emotionoui.oui.diary.dto.res.SearchDiarySettingRes;
import com.emotionoui.oui.diary.entity.Diary;
import com.emotionoui.oui.diary.exception.NotExitPrivateDiaryException;
import com.emotionoui.oui.diary.repository.DiaryRepository;
import com.emotionoui.oui.diary.service.DiaryService;
import com.emotionoui.oui.member.entity.Member;
import com.emotionoui.oui.member.repository.MemberRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.security.Principal;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ExecutionException;

@Slf4j
@RestController
@RequestMapping("/diary")
@RequiredArgsConstructor
public class DiaryController {

    private final DiaryService diaryService;
    private final DiaryRepository diaryRepository;
    private final MemberRepository memberRepository;

    // , @AuthenticationPrincipal Member member
    // 일기 게시글 작성하기
    @PostMapping
    public ResponseEntity<?> createDailyDiary(@RequestBody CreateDailyDiaryReq req, @AuthenticationPrincipal Member member) throws IOException, ExecutionException, InterruptedException {
        return new ResponseEntity<String>(diaryService.createDailyDiary(req, member), HttpStatus.OK);
    }

    // 일기 게시글 수정하기
    @PutMapping("/{dailyId}")
    public ResponseEntity<?> updateDailyDiary(@RequestBody UpdateDailyDiaryReq req, @PathVariable("dailyId") Integer dailyId){
        return new ResponseEntity<Integer>(diaryService.updateDailyDiary(req, dailyId), HttpStatus.OK);
    }

    // 일기 게시글 삭제하기
    @PutMapping("/delete/{dailyId}")
    public ResponseEntity<?> deleteDailyDiary(@PathVariable("dailyId") Integer dailyId){
        diaryService.deleteDailyDiary(dailyId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    // 일기 게시글 조회하기
    @GetMapping("/{dailyId}")
    public ResponseEntity<?> searchDailyDiary(@PathVariable("dailyId") Integer dailyId, @AuthenticationPrincipal Member member){
        return new ResponseEntity<SearchDailyDiaryRes>(diaryService.searchDailyDiary(dailyId, member.getMemberId()), HttpStatus.OK);
    }

    // 일기 게시글 날짜로 조회하기
    @GetMapping("/{diaryId}/{date}")
    public ResponseEntity<?> searchDailyDiary(@PathVariable("diaryId") Integer diaryId, @PathVariable("date") String date, @AuthenticationPrincipal Member member){
        return new ResponseEntity<Boolean>(diaryService.searchDailyDiaryByDate(diaryId, date, member.getMemberId()), HttpStatus.OK);
    }

    // 감정분석 결과 보여주기
    @GetMapping("/emotion/{dailyId}")
    public ResponseEntity<?> searchEmotion(@PathVariable("dailyId") Integer dailyId){
        return new ResponseEntity<EmotionClass>(diaryService.searchEmotion(dailyId), HttpStatus.OK);
    }

    // 추천노래 보여주기
    @GetMapping("/music/{dailyId}")
    public ResponseEntity<?> searchMusic(@PathVariable("dailyId") Integer dailyId){
        return new ResponseEntity<List<String>>(diaryService.searchMusic(dailyId), HttpStatus.OK);
    }

    // AI 코멘트 보여주기
    @GetMapping("/comment/{dailyId}")
    public ResponseEntity<?> searchComment(@PathVariable("dailyId") Integer dailyId){
        return new ResponseEntity<String>(diaryService.searchComment(dailyId), HttpStatus.OK);
    }

    // 다이어리 설정 조회하기
    @GetMapping("/setting/{diaryId}")
    public ResponseEntity<?> searchDiarySetting(@PathVariable("diaryId") Integer diaryId, @AuthenticationPrincipal Member member){
        Integer memberId = member.getMemberId();
        return new ResponseEntity<SearchDiarySettingRes>(diaryService.searchDiarySetting(diaryId, memberId), HttpStatus.OK);
    }

    // 다이어리 설정 수정하기
    @PutMapping("/setting/{diaryId}")
    public ResponseEntity<?> updateDiarySetting(@RequestBody UpdateDiarySettingReq req, @PathVariable("diaryId") Integer diaryId, @AuthenticationPrincipal Member member){
        Integer memberId = member.getMemberId();
        diaryService.updateDiarySetting(req, diaryId, memberId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

//    // 일기 꾸미기
//    @PostMapping("/decorate/{dailyId}")
//    public ResponseEntity<?> decorateDailyDiary(@RequestBody DecorateDailyDiaryReq req, @PathVariable("dailyId") Integer dailyId) throws IOException, ExecutionException, InterruptedException {
//        return new ResponseEntity<String>(diaryService.decorateDailyDiary(req, dailyId), HttpStatus.OK);
//    }

    // 일기 꾸미기
    // '/decorate/{dailyId}' 로 메시지를 보내면 'sub/decorate/daily{dailyId}' 로 응답이 전송됨
    // MessageMapping로 메세지가 들어오면 SendTo로 저 url을 구독한 사람들에게 다 보내주겠다
    @MessageMapping("/decorate/{dailyId}") // 클라이언트에서 보낸 메시지를 받을 메서드 지정
    @SendTo("sub/decorate/{dailyId}") // 메서드가 처리한 결과를 보낼 목적지 지정
    public ResponseEntity<?> decorateDailyDiary(@DestinationVariable Integer dailyId, Principal principal,
                                                @Payload DecorateDailyDiaryReq req) throws IOException, ExecutionException, InterruptedException {
        Member member = (Member)((Authentication) principal).getPrincipal();
        System.out.println(member.getMemberId());
        System.out.println(diaryService.decorateDailyDiary(req, member));
        return new ResponseEntity<DecorateDailyDiaryRes>(diaryService.decorateDailyDiary(req, member), HttpStatus.OK);
    }

    /* @DestinationVariable: 메시지의 목적지에서 변수를 추출
       @Payload: 메시지 본문(body)의 내용을 메서드의 인자로 전달할 때 사용
       (클라이언트가 JSON 형태의 메시지를 보냈다면, 이를 decorateMessage 객체로 변환하여 메서드에 전달)
    */

    // 다이어리 나가기
    @Transactional
    @PutMapping("/{diaryId}/delete")
    public ResponseEntity<?> exitShareDiary(@PathVariable("diaryId") Integer diaryId, @AuthenticationPrincipal Member member){
        diaryService.exitShareDiary(diaryId, member.getMemberId());
        return ResponseEntity.ok().build();
    }

    /**
     * 개인 다이어리 -> 공유 다이어리로 동기화
     * @param member
     * @param diaryId 공유 다이어리 id
     * @return
     */
    @Transactional
    @PostMapping("/sync/{diaryId}")
    public ResponseEntity<?> syncDiary(@AuthenticationPrincipal Member member, @PathVariable("diaryId") Integer diaryId){
        diaryService.syncDiary(member.getMemberId(), diaryId);
        return ResponseEntity.ok().build();
    }
}