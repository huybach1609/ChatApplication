package com.learn.websocket.handle;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.Map;

@Slf4j
@Component
public class MyWebSocketHandler extends TextWebSocketHandler {

    private WebSocketSessionManager sessionManager;

    public MyWebSocketHandler(WebSocketSessionManager sessionManager) {
        this.sessionManager = sessionManager;
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        String userId = getUserId(session);
        sessionManager.addSession(session, userId);
        System.out.println("Connection established");
    }

    // get info from session websocket during handshake continue.
    //  ws://localhost:8080/ws?userId=yourUserId
    private String getUserId(WebSocketSession session) {
        Map<String, Object> attributes = session.getAttributes();
        String u = (String) attributes.get("userId");
        log.info(u);
        return u;
    }

    //receive string form webSocket
    //validate format message,
    // validate userId is have in WebSocketSessionManager
    // send messsage
    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
//        String payload = message.getPayload();
//        System.out.println("Received: " + payload);
//        session.sendMessage(new TextMessage("Hello, " + payload + "!"));
        String payload = message.getPayload();
        System.out.println("Received: " + payload);
        String[] part = payload.split(":");
        if (part.length == 2) {
            String sender = getUserId(session);
            String targetUserId = part[0];
            String targetMessage = part[1];
            WebSocketSession targetSession = sessionManager.getSession(targetUserId);
            if (targetSession != null && targetSession.isOpen()) {
                targetSession.sendMessage(new TextMessage(sender + " : " + targetMessage));
            } else {
                session.sendMessage(new TextMessage("not found userId: " + targetUserId));
            }
        } else {
            session.sendMessage(new TextMessage("Wrong format"));
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        System.out.println("Connection closed");
        String userId = getUserId(session);
        sessionManager.removeSession(session, userId);
    }
}
