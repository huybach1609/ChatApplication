package com.practice.stompgateway.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Message {
    private String sender;
    private String content;
    private String receiver;
    private String type; // 'CHAT', 'JOIN', 'LEAVE'
}
