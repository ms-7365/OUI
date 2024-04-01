package com.emotionoui.oui.calendar.repository;

import com.emotionoui.oui.calendar.entity.Emotion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface EmotionRepository extends JpaRepository<Emotion, Integer> {

    @Query("SELECT e FROM Emotion e WHERE e.dailyDiary.id = :dailyId")
    Emotion findByDailyId(@Param("dailyId") Integer dailyId);
}
