package com.emotionoui.oui.diary.dto.res;

import com.emotionoui.oui.diary.entity.DailyDiary;
import com.emotionoui.oui.diary.entity.DailyDiaryCollection;
import com.emotionoui.oui.diary.entity.Diary;
import com.emotionoui.oui.member.entity.AlarmType;
import com.emotionoui.oui.member.entity.Member;
import com.emotionoui.oui.member.entity.MemberDiary;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

import java.util.List;

@Builder
@Getter
@ToString
@AllArgsConstructor
public class SearchDiarySettingRes {
    // 다이어리 이름
    private String name;
    // 템플릿 종류
    private Integer templateId;
    // 알람 ON/OFF 설정 상태
    private AlarmType alarm;
    // 공용다이어리에서의 멤버
    private List<String> memberList;


    public static SearchDiarySettingRes privateRes(Diary diary, AlarmType alarmStatus) {
        return SearchDiarySettingRes.builder()
                .name(diary.getName())
                .templateId(diary.getTemplateId())
                .alarm(alarmStatus)
                .build();
    }

    public static SearchDiarySettingRes SharingRes(Diary diary, AlarmType alarmStatus, List<String> memberList) {
        return SearchDiarySettingRes.builder()
                .name(diary.getName())
                .templateId(diary.getTemplateId())
                .alarm(alarmStatus)
                .memberList(memberList)
                .build();
    }
}
