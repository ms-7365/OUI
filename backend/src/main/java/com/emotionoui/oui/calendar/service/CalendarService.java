package com.emotionoui.oui.calendar.service;


import com.emotionoui.oui.calendar.dto.res.CalendarScheduleDto;
import com.emotionoui.oui.calendar.dto.res.CalendarDiaryDto;
import com.emotionoui.oui.calendar.dto.res.ShareDailyDiaryRes;
import com.emotionoui.oui.calendar.entity.Emotion;
import com.emotionoui.oui.calendar.repository.CalendarRepository;
import com.emotionoui.oui.diary.entity.DailyDiary;
import com.emotionoui.oui.diary.entity.DailyDiaryCollection;
import com.emotionoui.oui.diary.repository.DailyDiaryMongoRepository;
import com.emotionoui.oui.diary.repository.DailyDiaryRepository;
import com.emotionoui.oui.member.entity.Member;
import com.emotionoui.oui.member.repository.MemberDiaryRepository;
import com.emotionoui.oui.schedule.entity.Schedule;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CalendarService {

    private final CalendarRepository calendarRepository;
    private final MemberDiaryRepository memberDiaryRepository;
    private final DailyDiaryRepository dailyDiaryRepository;
    private final DailyDiaryMongoRepository dailyDiaryMongoRepository;

    // 캘린더에서 한달간 일기 조회 - 개인
    @Transactional(readOnly = true)
    public List<CalendarDiaryDto> findCalendarbyDate(Integer memberId, Integer year, Integer month){


        List<Emotion> emotionList = calendarRepository.findMyDiarybyDate(memberId, year, month+1);

        return emotionList.stream()
                .map(CalendarDiaryDto::of)
                .collect(Collectors.toList());
    }

    // 캘린더에서 한달간 일기 조회 - 공유
    @Transactional(readOnly = true)
    public List<CalendarDiaryDto> findShareDiarybyDate(Integer memberId, Integer year, Integer month, Integer diaryId){


        List<Emotion> emotionList = calendarRepository.findShareDiarybyDate(memberId, year, month+1, diaryId);

        return emotionList.stream()
                .map(CalendarDiaryDto::of)
                .collect(Collectors.toList());
    }

    // 일정 조회 - 개인
    @Transactional(readOnly = true)
    public List<CalendarScheduleDto> findMySchedulebyDate(Integer memberId, Integer year, Integer month){

        List<Schedule> scheduleList = calendarRepository.findMySchedulebyDate(memberId, year, month+1);

        return scheduleList.stream()
                .map(CalendarScheduleDto::of)
                .collect(Collectors.toList());
    }
    // 일정 조회 - 공유
    @Transactional(readOnly = true)
    public List<CalendarScheduleDto> findShareSchedulebyDate(Integer memberId, Integer year, Integer month, Integer diaryId){

        List<Schedule> scheduleList = calendarRepository.findShareSchedulebyDate(memberId, year, month+1, diaryId);

        return scheduleList.stream()
                .map(CalendarScheduleDto::of)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<Member> findMemberByDiaryId(Integer diaryId){

        List<Member> memberList = memberDiaryRepository.findMemberByDiaryId(diaryId);


        return memberList;
    }

    // 오늘 일기 찾기 - 공유
    @Transactional(readOnly = true)
    public ShareDailyDiaryRes searchDailyDiary(Integer dailyId) {
        DailyDiary dailyDiary = dailyDiaryRepository.findById(dailyId)
                .orElseThrow(IllegalArgumentException::new);

        DailyDiaryCollection dailyDiaryCollection = dailyDiaryMongoRepository.findById(dailyDiary.getMongoId())
                .orElseThrow(IllegalArgumentException::new);
        return ShareDailyDiaryRes.of(dailyDiaryCollection, dailyDiary);

    }
}
