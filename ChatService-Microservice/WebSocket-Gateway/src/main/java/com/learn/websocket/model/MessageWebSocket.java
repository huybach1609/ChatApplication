package com.learn.websocket.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class MessageWebSocket {
    private String sender;
    private String targetId;
    private String message;
    private Date timestamp;


}
