package com.learn.websocket.service;

import com.learn.commonservice.dto.MessageSendEvent;
import com.learn.websocket.model.Message;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class WebSocketService {

    private static final Logger log = LoggerFactory.getLogger(WebSocketService.class);
    @Autowired
    private KafkaTemplate<String, MessageSendEvent> kafkaTemplate;

    public void sendToMessageBroker(Message mess) {
        MessageSendEvent msg = new MessageSendEvent();
        BeanUtils.copyProperties(mess, msg);
        kafkaTemplate.send("sendMessage", msg);
        log.info("Message sent to broker {}", msg);
    }
}
