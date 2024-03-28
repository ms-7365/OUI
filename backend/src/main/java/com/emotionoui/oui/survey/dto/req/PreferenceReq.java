package com.emotionoui.oui.survey.dto.req;

import com.emotionoui.oui.member.entity.Member;
import com.emotionoui.oui.survey.entity.Preference;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class PreferenceReq {

    private int memberId;

    private String type;

}
