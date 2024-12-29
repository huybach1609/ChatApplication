package com.learn.websocket.handle;

import lombok.Getter;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketSession;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;


@Getter
@Component
public class WebSocketSessionManager {
    private final Map<String, WebSocketSession> sessions = Collections.synchronizedMap(new HashMap<>());

    public void addSession(WebSocketSession session, String userId) {
        sessions.put(userId,session);
    }

    public void removeSession(WebSocketSession session, String userId) {
        sessions.remove(userId);
    }
    public WebSocketSession getSession(String userId) {
       return sessions.get(userId);
    }


}
