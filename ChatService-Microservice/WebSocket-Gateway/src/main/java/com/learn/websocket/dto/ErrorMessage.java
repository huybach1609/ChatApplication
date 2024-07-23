package com.learn.websocket.dto;

import com.learn.commonservice.enums.MessageType;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ErrorMessage {
    private MessageType type;
    private String error;
}
