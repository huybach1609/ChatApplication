package com.learn.messageservice.model;

import lombok.Data;
import lombok.ToString;

@Data
@ToString
public class RelayMessageRequest {
    private String sender;
    private String to;
}
