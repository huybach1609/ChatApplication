package com.learn.commonservice.dto;

import com.learn.commonservice.enums.MessageType;
import lombok.*;

import java.util.Date;

@ToString
@Data
@AllArgsConstructor
@Builder
@NoArgsConstructor
public class MessageSendEvent {
    private String sender;
    private String to;
    private Date time;
    private String message;
    private MessageType type;
}
