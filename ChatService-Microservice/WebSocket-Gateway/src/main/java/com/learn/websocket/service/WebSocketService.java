package com.learn.websocket.service;

import com.learn.commonservice.dto.MessageSendEvent;
import com.learn.commonservice.enums.MessageType;
import com.learn.websocket.controller.UserSessionManager;
import com.learn.websocket.model.Message;
import com.learn.websocket.model.MessageWebSocket;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class WebSocketService {
    private final SimpMessagingTemplate messagingTemplate;
    private final UserSessionManager sessionManager;

    private static final Logger log = LoggerFactory.getLogger(WebSocketService.class);
    @Autowired
    private KafkaTemplate<String, MessageSendEvent> kafkaTemplate;

    public void sendToMessageBroker(Message mess) {
        MessageSendEvent msg = new MessageSendEvent();
        BeanUtils.copyProperties(mess, msg);
        kafkaTemplate.send("sendMessage", msg);
        log.info("Message sent to broker {}", msg);
    }

    public Message handelPrivateMessage(MessageWebSocket request){
        Message message = getMessage(request);
        log.info(request.toString());
        if(sessionManager.containsSession(message.getTo())){
            messagingTemplate.convertAndSendToUser(request.getTargetId(), "/private", message);
        }
        sendToMessageBroker(message);
        return message;
    }

    private Message getMessage(@Payload MessageWebSocket request) {
        Message response = new Message();
        response.setType(MessageType.DELIVERY);
        response.setMessage(request.getMessage());
        response.setTo(request.getTargetId());
        response.setSender(request.getSender());
        response.setTime(request.getTimestamp());
        return response;
    }

}
