package com.learn.messageservice.repository;

import com.learn.messageservice.model.Message;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepositoryCustom {
    public List<Message> getMessageByNumber(String sender, String to, int number);

    public List<Message> getListMessageById(String messageId, String sender, String to, int limit);
}
