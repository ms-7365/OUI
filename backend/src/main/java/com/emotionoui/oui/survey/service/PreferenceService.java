package com.emotionoui.oui.survey.service;

import com.emotionoui.oui.member.entity.Member;
import com.emotionoui.oui.survey.dto.req.PreferenceReq;
import com.emotionoui.oui.survey.entity.Preference;
import com.emotionoui.oui.survey.entity.PreferenceType;
import com.emotionoui.oui.survey.repository.PreferenceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Objects;

@Service
@RequiredArgsConstructor
public class PreferenceService {

    private final PreferenceRepository preferenceRepository;

    @Transactional
    public void savePreference(Member member, PreferenceReq preferenceReq){
        PreferenceType preferenceType;
        if(Objects.equals(preferenceReq.getType(), "표현")){
            preferenceType = PreferenceType.Blue;
        }else{
            preferenceType = PreferenceType.Yellow;
        }
        Preference preference = Preference.builder()
                .member(member)
                .type(preferenceType)
                .isDeleted(0)
                .build();
        preferenceRepository.save(preference);
    }

    public boolean isExisted(Member member){
        return preferenceRepository.existsByMemberMemberId(member.getMemberId());
    }
}
