package com.emotionoui.oui.calendar.controller;


import com.emotionoui.oui.alarm.service.AlarmService;
import com.emotionoui.oui.calendar.dto.req.FindDailyDiaryIdReq;
import com.emotionoui.oui.calendar.dto.res.*;
import com.emotionoui.oui.calendar.service.CalendarService;
import com.emotionoui.oui.diary.dto.res.SearchDailyDiaryRes;
import com.emotionoui.oui.diary.service.DiaryService;
import com.emotionoui.oui.member.entity.Member;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/calendar")
public class CalendarController {

    private final CalendarService calendarService;
    private final AlarmService alarmService;
    private final DiaryService diaryService;

    // 캘린더에서 한달간 내 일기와 일정 조회
    @GetMapping("/my")
    public ResponseEntity<?> searchMyCalendar(@RequestParam(name="date") @DateTimeFormat(pattern = "yyyy-MM-dd") Date date, @AuthenticationPrincipal Member member){

        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);

        Integer year = calendar.get(Calendar.YEAR);
        Integer month = calendar.get(Calendar.MONTH);

        List<CalendarDiaryDto> myDiaries =
                calendarService.findCalendarbyDate(member.getMemberId(), year, month);
        List<CalendarScheduleDto> myScehdule =
                calendarService.findMySchedulebyDate(member.getMemberId(), year, month);

        MyCalendarRes myCalendarRes = MyCalendarRes.builder()
                .diaries(myDiaries)
                .schedules(myScehdule)
                .build();

        return new ResponseEntity<>(myCalendarRes, HttpStatus.OK);

    }

    // 공유일기에서 한달간 모든 인원의 일기와 일정 조회
    @GetMapping("{diaryId}")
    public ResponseEntity<?> searchShareCalendar(@RequestParam(name="date") @DateTimeFormat(pattern = "yyyy-MM-dd") Date date,
                                                 @PathVariable(value= "diaryId") Integer diaryId){
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);

        Integer year = calendar.get(Calendar.YEAR);
        Integer month = calendar.get(Calendar.MONTH);

        ArrayList<MyCalendarRes> calendars = new ArrayList<>();

        // findMemberByDiaryId 로 멤버 다 찾고 for문 돌리면서 shareCalendarRes의 calendarResList에 넣기
        List<Member> memberList = calendarService.findMemberByDiaryId(diaryId);

        for(Member m : memberList){
            List<CalendarDiaryDto> myDiaries =
                    calendarService.findShareDiarybyDate(m.getMemberId(), year, month, diaryId);
            List<CalendarScheduleDto> myScehdule =
                    calendarService.findShareSchedulebyDate(m.getMemberId(), year, month, diaryId);

            MyCalendarRes myCalendarRes = MyCalendarRes.builder()
                    .diaries(myDiaries)
                    .schedules(myScehdule)
                    .build();

            calendars.add(myCalendarRes);
        }
        LocalDate localDate = LocalDate.ofInstant(date.toInstant(), ZoneId.systemDefault());
        ShareCalendarRes shareCalendarRes = ShareCalendarRes.builder()
                .diaryId(diaryId)
                .date(localDate.toString())
                .calendarResList(calendars)
                .build();

        return new ResponseEntity<>(shareCalendarRes, HttpStatus.OK);
    }

    // 친구에게 재촉하기 알림 보내기
    @PostMapping("/push/{diaryId}")
    public ResponseEntity<?> pushFriend(@PathVariable("diaryId") Integer diaryId, @AuthenticationPrincipal Member member, @RequestBody PushFriendRes res){
//        alarmService.sendFriendForcing(diaryId, member.getNickname(), res.getMemberId(), res.getDailyDate());
        alarmService.sendFriendForcing(diaryId, "선영이", res.getMemberId(), res.getDailyDate());
        return new ResponseEntity<>(HttpStatus.OK);
    }


    // 공유일기 오늘 일기 리스트 보기
    @GetMapping("/{diaryId}/day")
    public ResponseEntity<?> searchDailyDiary(@RequestParam(name="dailyId") List<Integer> dailyIdList){

        ArrayList<ShareDailyDiaryRes> dailyDiaryList = new ArrayList<>();

        for(Integer dailyId: dailyIdList){
            ShareDailyDiaryRes dailyDiary = calendarService.searchDailyDiary(dailyId);
            if(dailyDiary.getIsDeleted()==1) continue;
            dailyDiaryList.add(dailyDiary);
        }

        return new ResponseEntity<>(dailyDiaryList, HttpStatus.OK);
    }


    // 공유 일기 멤버 리스트
    @GetMapping("/{diaryId}/members")
    public ResponseEntity<?>findMemberByDiaryId(@PathVariable("diaryId") Integer diaryId){

        List<Member> memberList = calendarService.findMemberByDiaryId(diaryId);

        List<DiaryMemberDto> memberIdList = memberList.stream().map(DiaryMemberDto::of).collect(Collectors.toList());

        return new ResponseEntity<>(memberIdList, HttpStatus.OK);
    }

    // 공유 일기 라우팅 연결
    @GetMapping("/day")
    public ResponseEntity<?>findDailyDiaryIdByMongoId(FindDailyDiaryIdReq findDailyDiaryIdReq){
        System.out.println("findDailyDiaryIdReq = " + findDailyDiaryIdReq);
        Integer dailyDiaryId = diaryService.findDailyDiaryIdByMongoId(findDailyDiaryIdReq.getMongoId());
        System.out.println("dailyDiaryId = " + dailyDiaryId);
        return new ResponseEntity<>(dailyDiaryId, HttpStatus.OK);
    }
}
