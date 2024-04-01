package com.emotionoui.oui.calendar.dto.res;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.ArrayList;
import java.util.Date;

@Data
public class PushFriendRes {
    private Integer memberId;
    private String dailyDate;
}