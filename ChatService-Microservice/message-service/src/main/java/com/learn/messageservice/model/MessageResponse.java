package com.learn.messageservice.model;

import com.learn.commonservice.enums.MessageType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MessageResponse {
    private String sender;
    private String to;
    private Date time;
    private String message;
    private MessageType type;
}
