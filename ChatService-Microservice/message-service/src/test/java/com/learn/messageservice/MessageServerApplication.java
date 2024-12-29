package com.learn.messageservice;

import com.learn.messageservice.model.Message;
import com.learn.messageservice.repository.MessageRepository;
import com.learn.messageservice.repository.MessageRepositoryCustom;
import com.learn.messageservice.service.MessageService;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

@SpringBootTest
public class MessageServerApplication {
    private static final Logger log = LoggerFactory.getLogger(MessageServerApplication.class);

    @Autowired
    private MessageService messageService;

    @Test
    public void test() {

    }

}
