package com.emotionoui.oui.schedule.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QSchedule is a Querydsl query type for Schedule
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QSchedule extends EntityPathBase<Schedule> {

    private static final long serialVersionUID = -176164081L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QSchedule schedule = new QSchedule("schedule");

    public final StringPath color = createString("color");

    public final StringPath content = createString("content");

    public final DateTimePath<java.time.LocalDateTime> createdAt = createDateTime("createdAt", java.time.LocalDateTime.class);

    public final DateTimePath<java.util.Date> date = createDateTime("date", java.util.Date.class);

    public final com.emotionoui.oui.diary.entity.QDiary diary;

    public final NumberPath<Integer> isDeleted = createNumber("isDeleted", Integer.class);

    public final com.emotionoui.oui.member.entity.QMember member;

    public final NumberPath<Integer> scheduleId = createNumber("scheduleId", Integer.class);

    public final StringPath title = createString("title");

    public final EnumPath<ScheduleType> type = createEnum("type", ScheduleType.class);

    public QSchedule(String variable) {
        this(Schedule.class, forVariable(variable), INITS);
    }

    public QSchedule(Path<? extends Schedule> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QSchedule(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QSchedule(PathMetadata metadata, PathInits inits) {
        this(Schedule.class, metadata, inits);
    }

    public QSchedule(Class<? extends Schedule> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.diary = inits.isInitialized("diary") ? new com.emotionoui.oui.diary.entity.QDiary(forProperty("diary")) : null;
        this.member = inits.isInitialized("member") ? new com.emotionoui.oui.member.entity.QMember(forProperty("member"), inits.get("member")) : null;
    }

}

