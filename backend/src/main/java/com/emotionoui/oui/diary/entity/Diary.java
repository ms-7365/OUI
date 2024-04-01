package com.emotionoui.oui.diary.entity;

import com.emotionoui.oui.member.entity.MemberAlarm;
import com.emotionoui.oui.member.entity.MemberDiary;
import com.emotionoui.oui.schedule.entity.Schedule;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.SourceType;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@DynamicInsert
@Entity
@Getter
@EntityListeners({AuditingEntityListener.class})
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "DIARY")
public class Diary {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="diary_id")
    private Integer id;

    @OneToMany(mappedBy = "diary")
    private List<DailyDiary> dailyDiaryList = new ArrayList<>();

    @OneToMany(mappedBy = "diary")
    private List<MemberDiary> memberDiaryList = new ArrayList<>();

    @OneToMany(mappedBy = "diary")
    private List<MemberAlarm> memberAlarmList = new ArrayList<>();

    @OneToMany(mappedBy = "diary")
    private List<Schedule> scheduleList = new ArrayList<>();

    @Column(name="template_id")
    private Integer templateId;

    @Column(name = "type")
    @Enumerated(EnumType.STRING)
    private DiaryType type = DiaryType.공유;

    @Column(name = "name")
    private String name;

    @CreatedDate
    @LastModifiedDate
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "is_deleted")
    private Integer isDeleted = 0;

    @Builder
    public Diary(DiaryType type, String name, Integer templateId,  Integer isDeleted){
        this.name = name;
        this.type = type;
        this.templateId = templateId;
        this.isDeleted = isDeleted;
    }

    public void updateDiary(String name, Integer templateId){
        this.name = name;
        this.templateId = templateId;
    }

//    @PrePersist
//    public void setting(){
//        this.type = DiaryType.valueOf("공유");
//    }
}