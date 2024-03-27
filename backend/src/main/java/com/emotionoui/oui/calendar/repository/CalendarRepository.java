package com.emotionoui.oui.calendar.repository;


import com.emotionoui.oui.calendar.entity.Emotion;
import com.emotionoui.oui.schedule.entity.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface CalendarRepository extends JpaRepository<Emotion, Integer> {

    // 개인 일기 찾기
    @Query("SELECT e FROM Emotion e WHERE e.member.memberId = :memberId AND YEAR(e.date) = :year AND MONTH(e.date) =:month AND e.dailyDiary.diary.type =com.emotionoui.oui.diary.entity.DiaryType.개인 AND e.dailyDiary.diary.isDeleted = 0  ORDER BY e.date")
    List<Emotion> findMyDiarybyDate(Integer memberId, Integer year, Integer month);


    // 공유 일기 찾기
    @Query("SELECT e FROM Emotion e WHERE e.member.memberId = :memberId AND YEAR(e.date) = :year AND MONTH(e.date) =:month AND e.dailyDiary.diary.id =:diaryId AND e.dailyDiary.diary.isDeleted = 0 ORDER BY e.date  ")
    List<Emotion> findShareDiarybyDate(Integer memberId, Integer year, Integer month, Integer diaryId);


    // 개인 일정 찾기
    @Query("SELECT s FROM Schedule s WHERE s.member.memberId = :memberId AND YEAR(s.date) = :year AND MONTH(s.date) =:month AND s.isDeleted = 0 AND s.type =com.emotionoui.oui.schedule.entity.ScheduleType.개인 ORDER BY s.date")
    List<Schedule> findMySchedulebyDate(Integer memberId, Integer year, Integer month);

    // 공유 일정 찾기
    @Query("SELECT s FROM Schedule s WHERE s.member.memberId = :memberId AND YEAR(s.date) = :year AND MONTH(s.date) =:month AND s.isDeleted = 0 AND s.type =com.emotionoui.oui.schedule.entity.ScheduleType.공유 ORDER BY s.date")
    List<Schedule> findShareSchedulebyDate(Integer memberId, Integer year, Integer month);


}
