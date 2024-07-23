package com.learn.messageservice.model;

import com.learn.commonservice.enums.MessageType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@ToString
@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(value = "message")
public class Message {
    @Id
    private String id;
    private String sender;
    private String to;
    private Date time;
    private String message;
    private MessageType type;
}
