package com.emotionoui.oui.alarm.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.Map;

@Builder
@Getter
@AllArgsConstructor
public class AlarmTopicMessage {
    private boolean validateOnly;
    private Message message;

    @Builder
    @AllArgsConstructor
    @Getter
    public static class Message {
        private String token;
        private AlarmData data;
        private String topic;
    }

    @Builder
    @AllArgsConstructor
    @Getter
    public static class AlarmData {
        private String title;
        private String content;
        private String link;
    }
}
