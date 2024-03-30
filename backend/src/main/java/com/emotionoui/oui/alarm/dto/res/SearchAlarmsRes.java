package com.emotionoui.oui.alarm.dto.res;

import com.emotionoui.oui.alarm.entity.AlarmContentType;
import lombok.Builder;
import lombok.Data;


@Data
public class SearchAlarmsRes {
    private Integer alarmId;
    private Integer diaryId;
    private String link;
    private AlarmContentType alarmContentType;
    private String title;
    private String content;

    @Builder
    public SearchAlarmsRes(Integer alarmId, Integer diaryId, String link, AlarmContentType alarmContentType, String title, String content){
        this.alarmId = alarmId;
        this.diaryId = diaryId;
        this.link = link;
        this.alarmContentType = alarmContentType;
        this.title = title;
        this.content = content;
    }
}
