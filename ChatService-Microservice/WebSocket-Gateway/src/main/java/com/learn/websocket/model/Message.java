package com.learn.websocket.model;
import com.learn.commonservice.enums.MessageType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class Message {
   private String sender;
   private String to;
   private String message;
   private Date time;
   private MessageType type;
}
