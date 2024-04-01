package com.emotionoui.oui.diary.dto.req;

import com.emotionoui.oui.member.entity.AlarmType;
import com.emotionoui.oui.member.entity.Member;
import com.emotionoui.oui.member.entity.MemberDiary;
import lombok.Data;

import java.util.List;

@Data
public class UpdateDiarySettingReq {
    // 다이어리 이름
    private String name;
    // 템플릿 종류
    private Integer templateId;
    // 알람 ON/OFF 설정 상태
    private AlarmType alarm;
    // 공용다이어리에서의 새로운 멤버
    private List<String> memberList;
}
