package com.learn.messageservice.repository;

import com.learn.messageservice.model.Message;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public interface MessageRepository extends MongoRepository<Message, String> {
    @Query("{type:'NONDELIVERY', $or: [{sender : ?0, to : ?1}, {sender :  ?1,to : ?0}]}")
    public List<Message> getMessage(String sender, String to);
}
