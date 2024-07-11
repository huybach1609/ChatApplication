package com.learn.websocket.controller;


import com.learn.websocket.handle.WebSocketSessionManager;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("api/chat")
public class ChatController {
    @Autowired
    private WebSocketSessionManager sessionManager;


    @GetMapping("/info")
    public String getInfo() {
        return "UserController:getInfo";
    }

    @GetMapping("/getInfoConnection")
    public List<String> getInfoConnection() {
        List<String> list = new ArrayList<>();
        for(Map.Entry<String, WebSocketSession> entry: sessionManager.getSessions().entrySet()){
            list.add(entry.getKey());
        }
        return list;
    }

    @PostMapping("/send")
    public void sendMessageToUser(@RequestParam String userId, @RequestBody String message) {
        WebSocketSession session = sessionManager.getSession(userId);
        if (session != null && session.isOpen()) {
            try {
                session.sendMessage(new TextMessage(message));
                log.info("Message sent to user {}: {}", userId, message);
            } catch (IOException e) {
                log.error("Error sending message to user {}: {}", userId, e.getMessage());
            }
        } else {
            log.warn("No open session found for user {}", userId);
        }
    }

}
