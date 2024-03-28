package com.emotionoui.oui.survey.entity;

import com.emotionoui.oui.member.entity.Member;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@EntityListeners({AuditingEntityListener.class})
@Table(name = "PREFERENCE")
public class Preference {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "preference_id")
    private Integer preferenceId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @Enumerated(EnumType.STRING)
    @Column(name = "type")
    private PreferenceType type;

    @CreatedDate
    @LastModifiedDate
    @Column(name = "created_at")
    private LocalDateTime createdAt;


    @Column(name = "is_deleted")
    private Integer isDeleted;

    public void changeIsDelete(){
        this.isDeleted = 1;
    }

    @Builder
    public Preference(Integer preferenceId, Member member, PreferenceType type, LocalDateTime createdAt, Integer isDeleted) {
        this.preferenceId = preferenceId;
        this.member = member;
        this.type = type;
        this.createdAt = createdAt;
        this.isDeleted = isDeleted;
    }
}