package com.emotionoui.oui.schedule.dto.req;

import com.emotionoui.oui.member.entity.Member;
import com.emotionoui.oui.schedule.entity.Schedule;
import com.emotionoui.oui.schedule.entity.ScheduleType;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;

@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ScheduleReq {

    private String title;

    private String content;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd", timezone = "Asia/Seoul")
    private Date date;

    private  String color;

    private ScheduleType type;

    public Schedule toEntity(Member member, String title, String content, Date date, String color, ScheduleType type) {
        return Schedule.builder()
                .member(member)
                .title(title)
                .content(content)
                .date(date)
                .color(color)
                .type(type)
                .isDeleted(0)
                .createdAt(LocalDateTime.now())
                .build();
    }
}
