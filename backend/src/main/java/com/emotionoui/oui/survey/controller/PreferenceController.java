package com.emotionoui.oui.survey.controller;


import com.emotionoui.oui.member.entity.Member;
import com.emotionoui.oui.survey.dto.req.PreferenceReq;
import com.emotionoui.oui.survey.entity.Preference;
import com.emotionoui.oui.survey.service.PreferenceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/survey")
public class PreferenceController {

    private final PreferenceService preferenceService;

    // 선호 등록
    @PostMapping("/preference")
    public ResponseEntity<?> savePreference(@AuthenticationPrincipal Member member, @RequestBody PreferenceReq preferenceReq){
        preferenceService.savePreference(member, preferenceReq);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public Boolean isExisted(@AuthenticationPrincipal Member member){
        return preferenceService.isExisted(member);
    }

}
