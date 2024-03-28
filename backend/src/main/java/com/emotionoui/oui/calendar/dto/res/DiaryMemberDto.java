package com.emotionoui.oui.calendar.dto.res;

import com.emotionoui.oui.member.entity.Member;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;

@Builder
public class DiaryMemberDto {

    @JsonProperty("memberId")
    private Integer memberId;

    @JsonProperty("nickname")
    private String nickname;

    public static DiaryMemberDto of(Member member) {

        return DiaryMemberDto.builder()
                .memberId(member.getMemberId())
                .nickname(member.getNickname())
                .build();
    }
}
