package com.emotionoui.oui.schedule.dto.res;


import com.emotionoui.oui.schedule.entity.Schedule;
import com.emotionoui.oui.schedule.entity.ScheduleType;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;

import java.util.Date;

@Builder
public class ScheduleRes {

    @JsonProperty("member_id")
    private Integer memberId;

    @JsonProperty("title")
    private String title;

    @JsonProperty("content")
    private String content;

    @JsonProperty("date")
    private Date date;

    @JsonProperty("type")
    private ScheduleType type;

    public ScheduleRes of(Schedule schedule){

        return  ScheduleRes.builder()
                .memberId(schedule.getMember().getMemberId())
                .title(schedule.getTitle())
                .content(schedule.getContent())
                .date(schedule.getDate())
                .type(schedule.getType())
                .build();
    }
}
