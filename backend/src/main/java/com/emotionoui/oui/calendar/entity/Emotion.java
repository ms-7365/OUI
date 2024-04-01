package com.emotionoui.oui.calendar.entity;

import com.emotionoui.oui.diary.entity.DailyDiary;
import com.emotionoui.oui.member.entity.Member;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Date;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Table(name = "EMOTION")
public class Emotion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "emotion_id")
    private Integer emotionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @OneToOne
    @JoinColumn(name = "daily_diary_id")
    private DailyDiary dailyDiary;

    @Column(name = "date")
    private Date date;

    @Column(name = "emotion")
    private String emotion;

    @Builder
    public Emotion(Member member, DailyDiary dailyDiary, Date date, String emotion) {
        this.member = member;
        this.dailyDiary = dailyDiary;
        this.date = date;
        this.emotion = emotion;
    }

    @Override
    public String toString() {
        return "Emotion{" +
                "emotionId=" + emotionId +
                ", member=" + member.getMemberId() +
                ", dailyDiary=" + dailyDiary.getId() +
                ", date=" + date +
                ", emotion='" + emotion + '\'' +
                '}';
    }

    public void updateEmotion(String emotion){
        this.emotion = emotion;
    }
}
