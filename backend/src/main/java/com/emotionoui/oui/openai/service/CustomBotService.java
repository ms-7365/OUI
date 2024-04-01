package com.emotionoui.oui.openai.service;

import com.emotionoui.oui.openai.dto.ChatGPTRequest;
import com.emotionoui.oui.openai.dto.ChatGptResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.client.RestTemplate;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class CustomBotService {

    @Value("${openai.model}")
    private String model;

    @Value(("${openai.api.url}"))
    private String apiURL;

    @Autowired
    private RestTemplate template;

    public String chat(@RequestBody String prompt){
        String question = "나는 너의 소중한 친구야. 나의 일기를 보고, 따뜻한 격려나 공감,위로의 말을 해줘. 100자 이내로 부탁할게.^^\n"+prompt;
        ChatGPTRequest request=new ChatGPTRequest(model, question);
        ChatGptResponse chatGptResponse = template.postForObject(apiURL, request, ChatGptResponse.class);
        return chatGptResponse.getChoices().get(0).getMessage().getContent();
    }
}
