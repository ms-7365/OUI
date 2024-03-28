package com.emotionoui.oui.diary.config;

import com.emotionoui.oui.diary.interceptor.DiaryInterceptor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.Message;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;


@Slf4j
@Configuration
@EnableWebSocketMessageBroker
@RequiredArgsConstructor
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {


    private String current = "blank";
    private final DiaryInterceptor diaryInterceptor;
    @Override
    public void configureMessageBroker(MessageBrokerRegistry config){
        // sub로 들어오는 요청을 처리해주기 위해
        config.enableSimpleBroker("/sub"); // 채널 만들기
        // pub로 들어오는 요청을 처리해주기 위해
        config.setApplicationDestinationPrefixes("/pub"); // 구독한 사람들에게 보내주기
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry){
        registry.addEndpoint("/ws").setAllowedOriginPatterns("*").withSockJS();
        // registry.addEndpoint("/ws-stomp").setAllowedOriginPatterns("*");
        // Endpoint 지정, setAllowedOriginPatterns("*")를 통해 요청 url 전부 허용
        // + withSockJs() 함수를 통해 ws, wss로 socket을 연결하는 것이 아닌 http, https로 socket을 연결하도록 바꾸어줌
    }

    @EventListener
    public void connectEvent(SessionConnectEvent sessionConnectEvent) {
        current = "now I'm here";
        System.out.println(sessionConnectEvent);
        System.out.println("연결 성공!");
        System.out.println(current);
        // return "redirect:chat/message";
    }

    @EventListener
    public void onDisconnectEvent(SessionDisconnectEvent sessionDisconnectEvent) {

        Message<byte[]> message = sessionDisconnectEvent.getMessage();
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);
        StompCommand command = accessor.getCommand();

        if (StompCommand.DISCONNECT.equals(command)){

            // 자동 저장하는 코드를 넣어줌
//            Long chatRoomId = (Long) ((Map<String, Object>)message.getHeaders().get("simpSessionAttributes")).get("chatRoomId");
//            String userId = (String) ((Map<String, Object>)message.getHeaders().get("simpSessionAttributes")).get("userId");
//            log.info("chatRoomId : " + chatRoomId);
//
//            // chatRoomService.updateLatestChat(userId, chatRoomId);

        }

        System.out.println(sessionDisconnectEvent);
        System.out.println(current);
        System.out.println("연결 끊어짐!");
    }

    // 클라이언트로부터 들어오는 메세지를 처리할 인터셉터를 설정
    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(diaryInterceptor);
    }
}