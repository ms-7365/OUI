package com.emotionoui.oui.survey.repository;

import com.emotionoui.oui.survey.entity.Preference;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PreferenceRepository extends JpaRepository<Preference, Integer> {

    boolean existsByMemberMemberIdAndIsDeleted(Integer memberId, Integer isDeleted);
}
