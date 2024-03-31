package com.emotionoui.oui.schedule.entity;

import com.emotionoui.oui.alarm.entity.Alarm;
import com.emotionoui.oui.diary.entity.Diary;
import com.emotionoui.oui.member.entity.Member;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;

@Entity
@NoArgsConstructor
@Getter
@Table(name = "SCHEDULE")
@EntityListeners({AuditingEntityListener.class})
public class Schedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "schedule_id")
    private Integer scheduleId;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "diary_id", nullable = false)
    private Diary diary;

    private String title;

    private String content;

    private Date date;

    private String color;

    @Column(name = "type")
    @Enumerated(EnumType.STRING)
    private ScheduleType  type = ScheduleType.공유;


    @CreatedDate
    @LastModifiedDate
    @Column(name = "created_at")
    private LocalDateTime createdAt;


    @Column(name = "is_deleted")
    private Integer isDeleted;

    public void changeTitle(String title){
        this.title = title;
    }

    public void changeContent(String content){
        this.content = content;
    }

    public void changeIsDelete(){
        this.isDeleted = 1;
    }


    @Builder
    public Schedule(Integer scheduleId, Member member, Diary diary, String title, String content, Date date, String color, Integer isDeleted, LocalDateTime createdAt, ScheduleType type) {
        this.scheduleId = scheduleId;
        this.member = member;
        this.diary = diary;
        this.title = title;
        this.content = content;
        this.date = date;
        this.color = color;
        this.createdAt = createdAt;
        this.isDeleted = isDeleted;
        this.type = type;
        diary.getScheduleList().add(this);
    }

}