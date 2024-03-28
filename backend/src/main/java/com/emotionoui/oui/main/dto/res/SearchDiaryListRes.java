package com.emotionoui.oui.main.dto.res;

import com.emotionoui.oui.diary.entity.Diary;
import com.emotionoui.oui.diary.entity.DiaryType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;
import org.jetbrains.annotations.NotNull;

import java.time.LocalDateTime;
@Builder
@Getter
@ToString
@AllArgsConstructor
public class SearchDiaryListRes implements Comparable<SearchDiaryListRes> {

    private int diaryId;

    private String diaryName;

    private int memberId;

    private DiaryType type; // 공유/개인 구분을 위한 타입

    private int templateId;

    private LocalDateTime createdAt;

    private int orders; // 다이어리 순서

    public SearchDiaryListRes(int diaryId, String diaryName, int templateId, int memberId, DiaryType type, LocalDateTime createdAt, int orders) {
        this.diaryId = diaryId;
        this.diaryName = diaryName;
        this.templateId = templateId;
        this.memberId = memberId;
        this.type = type;
        this.createdAt = createdAt;
        this.orders= orders;
    }

    @Override
    public int compareTo(@NotNull SearchDiaryListRes o) {
        return Integer.compare(this.orders,o.orders);
    }
}
