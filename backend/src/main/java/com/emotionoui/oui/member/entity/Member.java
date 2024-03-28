package com.emotionoui.oui.member.entity;

import com.emotionoui.oui.alarm.entity.FcmInfo;
import com.emotionoui.oui.calendar.entity.Emotion;
import com.emotionoui.oui.member.entity.MemberAlarm;
import com.emotionoui.oui.member.entity.MemberDiary;
import com.emotionoui.oui.schedule.entity.Schedule;
import com.emotionoui.oui.survey.entity.Preference;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.SourceType;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Entity
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Table(name="MEMBER")
public class Member implements UserDetails {

    @Id
    @Column(name="member_id")
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer memberId;

    @Column(name="email", nullable = false)
    private String email;

    @Column(name="nickname")
    private String nickname;

    @Column(name="password")
    private String password;

    @Column(name="img")
    private String img;

    @CreationTimestamp(source = SourceType.DB)
    @Column(name="regdate", nullable = false)
    private LocalDateTime regdate;

    @Column(name="is_deleted", nullable = false)
    private int isDeleted = 0;


    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return null;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return isDeleted == 0;
    }

    @OneToMany(mappedBy = "member", fetch = FetchType.EAGER)
    private List<MemberAlarm> memberAlarmList = new ArrayList<>();

    @OneToMany(mappedBy = "member", fetch = FetchType.EAGER)
    private List<Preference> preferenceList = new ArrayList<>();

    @OneToMany(mappedBy = "member", fetch = FetchType.EAGER)
    private List<Schedule> scheduleList = new ArrayList<>();

    @OneToMany(mappedBy = "member", fetch = FetchType.EAGER)
    private List<Emotion> emotionList = new ArrayList<>();

    @OneToMany(mappedBy = "member", fetch = FetchType.EAGER)
    private List<MemberDiary> memberDiaryList = new ArrayList<>();

    @Setter
    @OneToOne(mappedBy = "member")
    private FcmInfo fcmInfo;

    public Member(String email, String nickname) {
        this.email = email;
        this.nickname = nickname;
    }

    @Builder
    public Member(int memberId, String email, String nickname, String img, LocalDateTime regdate){
        this.memberId= memberId;
        this.email = email;
        this.nickname = nickname;
        this.img = img;
        this.regdate= regdate;
    }
}
