package com.emotionoui.oui.survey.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QPreference is a Querydsl query type for Preference
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QPreference extends EntityPathBase<Preference> {

    private static final long serialVersionUID = -177251754L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QPreference preference = new QPreference("preference");

    public final DateTimePath<java.time.LocalDateTime> createdAt = createDateTime("createdAt", java.time.LocalDateTime.class);

    public final NumberPath<Integer> isDeleted = createNumber("isDeleted", Integer.class);

    public final com.emotionoui.oui.member.entity.QMember member;

    public final NumberPath<Integer> preferenceId = createNumber("preferenceId", Integer.class);

    public final EnumPath<PreferenceType> type = createEnum("type", PreferenceType.class);

    public QPreference(String variable) {
        this(Preference.class, forVariable(variable), INITS);
    }

    public QPreference(Path<? extends Preference> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QPreference(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QPreference(PathMetadata metadata, PathInits inits) {
        this(Preference.class, metadata, inits);
    }

    public QPreference(Class<? extends Preference> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.member = inits.isInitialized("member") ? new com.emotionoui.oui.member.entity.QMember(forProperty("member"), inits.get("member")) : null;
    }

}

