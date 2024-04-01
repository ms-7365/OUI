package com.emotionoui.oui.member.repository;

import com.emotionoui.oui.diary.entity.DiaryType;
import com.emotionoui.oui.member.entity.AlarmType;
import com.emotionoui.oui.member.entity.Member;
import com.emotionoui.oui.member.entity.MemberDiary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MemberDiaryRepository extends JpaRepository<MemberDiary, Integer> {

    @Query("SELECT m.alarm FROM MemberDiary m WHERE m.diary.id = :diaryId AND m.member.memberId = :memberId")
    AlarmType findAlarmByMemberIdAndDiaryId(Integer diaryId, Integer memberId);

    @Query("SELECT m.member FROM MemberDiary m WHERE m.diary.id = :diaryId")
    List<Member> findMemberByDiaryId(@Param("diaryId") Integer diaryId);

    @Query("SELECT m.member.email FROM MemberDiary m WHERE m.diary.id = :diaryId")
    List<String> findEmailByDiaryId(@Param("diaryId") Integer diaryId);

    @Query("SELECT m FROM MemberDiary m WHERE m.member.memberId= :newMemberId")
    MemberDiary findByMemberId(@Param("newMemberId") Integer newMemberId);

    @Query("SELECT COUNT(m.id) FROM MemberDiary m WHERE m.member.memberId = :memberId AND m.isDeleted = 0")
    Integer countByMemberId(@Param("memberId") Integer memberId);

    @Query("SELECT m FROM MemberDiary m WHERE m.member.memberId = :memberId AND m.diary.type = :diaryType")
    Optional<MemberDiary> findPersonalMemberDiary(@Param("memberId") Integer memberId, @Param("diaryType") DiaryType diaryType);

}