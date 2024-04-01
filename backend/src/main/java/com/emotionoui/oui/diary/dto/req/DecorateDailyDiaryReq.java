package com.emotionoui.oui.diary.dto.req;

import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

@Data
public class DecorateDailyDiaryReq {
    // 다이어리 ID
    private Integer diaryId;
    // 꾸미기 하나 내용
    private String oneDecoration;
    // 꾸미기 전체 내용
    private String allDecoration;
}
