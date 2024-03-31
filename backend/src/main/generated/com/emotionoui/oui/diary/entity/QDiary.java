package com.emotionoui.oui.diary.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QDiary is a Querydsl query type for Diary
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QDiary extends EntityPathBase<Diary> {

    private static final long serialVersionUID = -1659045593L;

    public static final QDiary diary = new QDiary("diary");

    public final DateTimePath<java.time.LocalDateTime> createdAt = createDateTime("createdAt", java.time.LocalDateTime.class);

    public final ListPath<DailyDiary, QDailyDiary> dailyDiaryList = this.<DailyDiary, QDailyDiary>createList("dailyDiaryList", DailyDiary.class, QDailyDiary.class, PathInits.DIRECT2);

    public final NumberPath<Integer> id = createNumber("id", Integer.class);

    public final NumberPath<Integer> isDeleted = createNumber("isDeleted", Integer.class);

    public final ListPath<com.emotionoui.oui.member.entity.MemberAlarm, com.emotionoui.oui.member.entity.QMemberAlarm> memberAlarmList = this.<com.emotionoui.oui.member.entity.MemberAlarm, com.emotionoui.oui.member.entity.QMemberAlarm>createList("memberAlarmList", com.emotionoui.oui.member.entity.MemberAlarm.class, com.emotionoui.oui.member.entity.QMemberAlarm.class, PathInits.DIRECT2);

    public final ListPath<com.emotionoui.oui.member.entity.MemberDiary, com.emotionoui.oui.member.entity.QMemberDiary> memberDiaryList = this.<com.emotionoui.oui.member.entity.MemberDiary, com.emotionoui.oui.member.entity.QMemberDiary>createList("memberDiaryList", com.emotionoui.oui.member.entity.MemberDiary.class, com.emotionoui.oui.member.entity.QMemberDiary.class, PathInits.DIRECT2);

    public final StringPath name = createString("name");

    public final ListPath<com.emotionoui.oui.schedule.entity.Schedule, com.emotionoui.oui.schedule.entity.QSchedule> scheduleList = this.<com.emotionoui.oui.schedule.entity.Schedule, com.emotionoui.oui.schedule.entity.QSchedule>createList("scheduleList", com.emotionoui.oui.schedule.entity.Schedule.class, com.emotionoui.oui.schedule.entity.QSchedule.class, PathInits.DIRECT2);

    public final NumberPath<Integer> templateId = createNumber("templateId", Integer.class);

    public final EnumPath<DiaryType> type = createEnum("type", DiaryType.class);

    public QDiary(String variable) {
        super(Diary.class, forVariable(variable));
    }

    public QDiary(Path<? extends Diary> path) {
        super(path.getType(), path.getMetadata());
    }

    public QDiary(PathMetadata metadata) {
        super(Diary.class, metadata);
    }

}

