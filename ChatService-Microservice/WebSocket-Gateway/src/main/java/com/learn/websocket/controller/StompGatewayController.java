package com.learn.websocket.controller;

import com.learn.commonservice.enums.MessageType;
import com.learn.websocket.model.Message;
import com.learn.websocket.model.MessageWebSocket;
import com.learn.websocket.service.WebSocketService;
import lombok.extern.slf4j.Slf4j;
import org.springdoc.core.converters.ResponseSupportConverter;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Slf4j
@Controller
public class StompGatewayController {

    private final WebSocketService service;

    public StompGatewayController(WebSocketService service) {
        this.service = service;
    }

//    @MessageMapping("/message")
//    @SendTo("/chatroom/public")
//    public Message sendMessage(@Payload MessageWebSocket request) {
//        Message message = getMessage(request);
//        message.setType(MessageType.NONDELIVERY);
//        return message;
//    }

    @MessageMapping("/private-message")
    public Message privateMessage(@Payload MessageWebSocket request) {
       return service.handelPrivateMessage(request);
    }
}
