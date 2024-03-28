package com.emotionoui.oui.diary.dto.res;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DecorateDailyDiaryRes {
    
    // 꾸민 멤버
    private Integer memberId;
    private String nickname;
    // 꾸미기 내용
    private String decoration;
}


