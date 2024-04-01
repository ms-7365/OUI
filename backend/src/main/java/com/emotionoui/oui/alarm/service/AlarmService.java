package com.emotionoui.oui.alarm.service;

import com.emotionoui.oui.alarm.dto.req.AlarmTestReq;
import com.emotionoui.oui.alarm.dto.res.SearchAlarmsRes;
import com.emotionoui.oui.diary.entity.Diary;
import com.emotionoui.oui.member.entity.Member;

import java.io.IOException;
import java.util.Date;
import java.util.List;


public interface AlarmService {
    public void sendMessageTo(AlarmTestReq alarmTestReq) throws IOException;

    public void createDeviceToken(Member member, String deviceToken);
    public void inviteDiary(List<String> emails, Integer diaryId, String createrNickname);
    public void sendFriendForcing(Integer diaryId, String pusherNickname, Integer memberId, String date);
    public void sendFriendDiary(Diary diary, Integer dailyId, Member member);
    public void sendSystemForcing(Member member, String date);

    public List<SearchAlarmsRes> searchAlarmList(Integer memberId);

    public void deleteAlarms(Integer memberId);

    public void acceptInvite(Member member, Integer diaryId);

    public void refuseInvite(Member member, Integer diaryId);

    public void readAlarm(Member member, Integer alarmId);
}
