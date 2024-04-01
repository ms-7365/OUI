package com.emotionoui.oui.member.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QMember is a Querydsl query type for Member
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QMember extends EntityPathBase<Member> {

    private static final long serialVersionUID = -1066577707L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QMember member = new QMember("member1");

    public final StringPath email = createString("email");

    public final ListPath<com.emotionoui.oui.calendar.entity.Emotion, com.emotionoui.oui.calendar.entity.QEmotion> emotionList = this.<com.emotionoui.oui.calendar.entity.Emotion, com.emotionoui.oui.calendar.entity.QEmotion>createList("emotionList", com.emotionoui.oui.calendar.entity.Emotion.class, com.emotionoui.oui.calendar.entity.QEmotion.class, PathInits.DIRECT2);

    public final com.emotionoui.oui.alarm.entity.QFcmInfo fcmInfo;

    public final StringPath img = createString("img");

    public final NumberPath<Integer> isDeleted = createNumber("isDeleted", Integer.class);

    public final ListPath<MemberAlarm, QMemberAlarm> memberAlarmList = this.<MemberAlarm, QMemberAlarm>createList("memberAlarmList", MemberAlarm.class, QMemberAlarm.class, PathInits.DIRECT2);

    public final ListPath<MemberDiary, QMemberDiary> memberDiaryList = this.<MemberDiary, QMemberDiary>createList("memberDiaryList", MemberDiary.class, QMemberDiary.class, PathInits.DIRECT2);

    public final NumberPath<Integer> memberId = createNumber("memberId", Integer.class);

    public final StringPath nickname = createString("nickname");

    public final ListPath<com.emotionoui.oui.survey.entity.Preference, com.emotionoui.oui.survey.entity.QPreference> preferenceList = this.<com.emotionoui.oui.survey.entity.Preference, com.emotionoui.oui.survey.entity.QPreference>createList("preferenceList", com.emotionoui.oui.survey.entity.Preference.class, com.emotionoui.oui.survey.entity.QPreference.class, PathInits.DIRECT2);

    public final DateTimePath<java.time.LocalDateTime> regdate = createDateTime("regdate", java.time.LocalDateTime.class);

    public final ListPath<com.emotionoui.oui.schedule.entity.Schedule, com.emotionoui.oui.schedule.entity.QSchedule> scheduleList = this.<com.emotionoui.oui.schedule.entity.Schedule, com.emotionoui.oui.schedule.entity.QSchedule>createList("scheduleList", com.emotionoui.oui.schedule.entity.Schedule.class, com.emotionoui.oui.schedule.entity.QSchedule.class, PathInits.DIRECT2);

    public QMember(String variable) {
        this(Member.class, forVariable(variable), INITS);
    }

    public QMember(Path<? extends Member> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QMember(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QMember(PathMetadata metadata, PathInits inits) {
        this(Member.class, metadata, inits);
    }

    public QMember(Class<? extends Member> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.fcmInfo = inits.isInitialized("fcmInfo") ? new com.emotionoui.oui.alarm.entity.QFcmInfo(forProperty("fcmInfo"), inits.get("fcmInfo")) : null;
    }

}

