package com.learn.messageservice.service;

import com.learn.commonservice.dto.MessageSendEvent;
import com.learn.commonservice.enums.MessageType;
import com.learn.messageservice.model.Message;
import com.learn.messageservice.model.MessageResponse;
import com.learn.messageservice.repository.MessageRepository;
import com.learn.messageservice.repository.MessageRepositoryCustom;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class MessageService {
    private static final Logger log = LoggerFactory.getLogger(MessageService.class);
    private final MessageRepository repository;
    private final MessageRepositoryCustom messageRepositoryCustom;

    public MessageService(MessageRepository repository, MessageRepositoryCustom messageRepositoryCustom) {
        this.repository = repository;
        this.messageRepositoryCustom = messageRepositoryCustom;
    }

    public void addMessage(Message message) {
        message.setTime(new Date());
        message.setType(MessageType.DELIVERY);
        log.info("message: {}", message);
        repository.save(message);
    }

    @KafkaListener(topics = "sendMessage", groupId = "message-consumers")
    public void processMessageQueue(MessageSendEvent messageSendEvent){
        log.info("get message: {}", messageSendEvent);
        Message message = new Message();
        BeanUtils.copyProperties(messageSendEvent, message);
        repository.save(message);
    }

    public List<MessageResponse> getMessageByNumber(String sender, String to, int number) {

        return  messageRepositoryCustom.getMessageByNumber(sender, to, number).stream().map(
                mess -> {
                    MessageResponse messageResponse = new MessageResponse();
                    BeanUtils.copyProperties(mess, messageResponse);
                    return messageResponse;
                }
        ).toList();
    }
}
