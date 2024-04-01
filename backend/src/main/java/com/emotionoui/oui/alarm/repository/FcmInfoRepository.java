package com.emotionoui.oui.alarm.repository;

import com.emotionoui.oui.alarm.entity.FcmInfo;
import com.emotionoui.oui.member.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface FcmInfoRepository extends JpaRepository<FcmInfo, Integer> {

    FcmInfo findByMember(Member member);

    @Query("SELECT f.deviceToken FROM FcmInfo f WHERE f.member.memberId NOT IN (SELECT e.member.memberId FROM Emotion e WHERE e.date = :date)")
    List<String> findDeviceTokensWithDataNotExist(@Param("date") Date date);

    @Query("SELECT f.member FROM FcmInfo f WHERE f.member.memberId NOT IN (SELECT e.member.memberId FROM Emotion e WHERE e.date = :date)")
    List<Member> findMemberWithDataNotExist(@Param("date") Date date);
}
