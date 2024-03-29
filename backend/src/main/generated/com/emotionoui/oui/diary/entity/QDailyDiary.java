package com.emotionoui.oui.diary.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QDailyDiary is a Querydsl query type for DailyDiary
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QDailyDiary extends EntityPathBase<DailyDiary> {

    private static final long serialVersionUID = -1055676858L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QDailyDiary dailyDiary = new QDailyDiary("dailyDiary");

    public final DatePath<java.util.Date> dailyDate = createDate("dailyDate", java.util.Date.class);

    public final QDiary diary;

    public final NumberPath<Integer> id = createNumber("id", Integer.class);

    public final NumberPath<Integer> isDeleted = createNumber("isDeleted", Integer.class);

    public final StringPath mongoId = createString("mongoId");

    public QDailyDiary(String variable) {
        this(DailyDiary.class, forVariable(variable), INITS);
    }

    public QDailyDiary(Path<? extends DailyDiary> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QDailyDiary(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QDailyDiary(PathMetadata metadata, PathInits inits) {
        this(DailyDiary.class, metadata, inits);
    }

    public QDailyDiary(Class<? extends DailyDiary> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.diary = inits.isInitialized("diary") ? new QDiary(forProperty("diary")) : null;
    }

}

