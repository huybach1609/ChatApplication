package com.learn.messageservice.repository.impl;


import com.learn.messageservice.model.Message;
import com.learn.messageservice.repository.MessageRepository;
import com.learn.messageservice.repository.MessageRepositoryCustom;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public class MessageRepositoryImpl implements MessageRepositoryCustom {
    @Autowired
    private MongoTemplate mongoTemplate;

    @Override
    public List<Message> getMessageByNumber(String sender, String to, int limit) {
        Query query = new Query().addCriteria(
                        new Criteria().orOperator(
                                Criteria.where("sender").is(sender).and("to").is(to),
                                Criteria.where("sender").is(to).and("to").is(sender)
                        ))
                .with(Sort.by(Sort.Direction.DESC, "time"))
                .limit(limit);
        return mongoTemplate.find(query, Message.class);
    }

    @Override
    public List<Message> getListMessageById(String messageid, String sender, String to, int limit) {
        Query query = new Query()
                .addCriteria(
                        new Criteria().orOperator(
                                Criteria.where("sender").is(sender).and("to").is(to),
                                Criteria.where("sender").is(to).and("to").is(sender)
                        ))
                .addCriteria(Criteria.where("_id").lt(new ObjectId(messageid)))
                .with(Sort.by(Sort.Direction.DESC, "time"))
                .limit(limit);
        return mongoTemplate.find(query, Message.class);
    }

}
