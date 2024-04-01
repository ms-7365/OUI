package com.emotionoui.oui.survey.repository;

import com.emotionoui.oui.schedule.entity.Schedule;
import com.emotionoui.oui.survey.entity.Preference;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PreferenceRepository extends JpaRepository<Preference, Integer> {

    boolean existsByMemberMemberIdAndIsDeleted(Integer memberId, Integer isDeleted);

    @Query("SELECT p.type FROM Preference p WHERE p.member.memberId = :memberId AND p.isDeleted = 0")
    String getTypeByMemberId(Integer memberId);

}
