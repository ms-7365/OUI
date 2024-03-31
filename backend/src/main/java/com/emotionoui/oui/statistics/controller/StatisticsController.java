package com.emotionoui.oui.statistics.controller;

import com.emotionoui.oui.member.entity.Member;
import com.emotionoui.oui.statistics.dto.req.StatisticsReq;
import com.emotionoui.oui.statistics.dto.res.DiaryEmotionRes;
import com.emotionoui.oui.statistics.service.StatisticsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.time.temporal.WeekFields;
import java.util.*;

@Slf4j
@Controller
@RequestMapping("/statistics")
@RequiredArgsConstructor
public class StatisticsController {

    private final StatisticsService statisticsService;

    @GetMapping("/my/month")
    public ResponseEntity<HashMap<String, Double>> getMyMonthEmotion(StatisticsReq req){

        Integer diaryId = req.getDiaryId();
        HashMap<String, Double> emotions =statisticsService.getMyMonth(diaryId,req.getDate());

        return new ResponseEntity<>(emotions,HttpStatus.OK);
    }

    @GetMapping("/my/week")
    public ResponseEntity<HashMap<Date, double[]>> getMyWeekEmotion(StatisticsReq req){
        System.out.println("req.getDate() = " + req.getDate());
        System.out.println("req.getDiaryId() = " + req.getDiaryId());

        return new ResponseEntity<>(statisticsService.getMyWeek(req.getDiaryId(), req.getDate()),HttpStatus.OK);
    }

    @GetMapping("/{diaryId}")
    public ResponseEntity<DiaryEmotionRes> getDiaryEmotion(@AuthenticationPrincipal Member member, StatisticsReq req,@PathVariable Integer diaryId){
        DiaryEmotionRes res = statisticsService.getDiaryEmotion(member,diaryId,req.getDate());
        return new ResponseEntity<>(res,HttpStatus.OK);
    }

    public static String getCurrentWeekOfMonth(LocalDate localDate) {
        WeekFields weekFields = WeekFields.of(DayOfWeek.MONDAY, 4);

        int weekOfMonth = localDate.get(weekFields.weekOfMonth());

        if (weekOfMonth == 0) {
            LocalDate lastDayOfLastMonth = localDate.with(TemporalAdjusters.firstDayOfMonth()).minusDays(1);
            return getCurrentWeekOfMonth(lastDayOfLastMonth);
        }
//
        LocalDate lastDayOfMonth = localDate.with(TemporalAdjusters.lastDayOfMonth());
        if (weekOfMonth == lastDayOfMonth.get(weekFields.weekOfMonth()) && lastDayOfMonth.getDayOfWeek().compareTo(DayOfWeek.THURSDAY) < 0) {
            LocalDate firstDayOfNextMonth = lastDayOfMonth.plusDays(1); // 마지막 날 + 1일 => 다음달 1일
            return getCurrentWeekOfMonth(firstDayOfNextMonth);
        }

        return localDate.getMonthValue() + "월 " + weekOfMonth + "주차";
    }
}
