package com.learn.websocket.handle;

import com.google.gson.Gson;
import com.learn.commonservice.enums.MessageType;
import com.learn.websocket.dto.ErrorMessage;
import com.learn.websocket.model.Message;
import com.learn.websocket.model.MessageWebSocket;
import com.learn.websocket.service.WebSocketService;
import lombok.extern.slf4j.Slf4j;
import org.ietf.jgss.GSSName;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.Date;
import java.util.Map;

@Slf4j
@Component
public class MyWebSocketHandler extends TextWebSocketHandler {

    private WebSocketSessionManager sessionManager;
    private final WebSocketService service;

    public MyWebSocketHandler(WebSocketSessionManager sessionManager, WebSocketService service) {
        this.sessionManager = sessionManager;
        this.service = service;
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

    // receive string form webSocket
    // validate format message,
    // validate userId has in WebSocketSessionManager
    // send message
    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String payload = message.getPayload();
        String sender = getUserId(session);
        Gson gson = new Gson();

        MessageWebSocket input = gson.fromJson(payload, MessageWebSocket.class);
        Message mess = new Message(MessageType.DELIVERY, sender, input.getTargetId(), input.getMessage(), new Date());

        WebSocketSession targetSession = sessionManager.getSession(input.getTargetId());
        log.info("it go here");
        // check target online or offline
        if (targetSession != null && targetSession.isOpen()) {
            log.info(mess.getMessage());
            service.sendToMessageBroker(mess);
            targetSession.sendMessage(new TextMessage(gson.toJson(mess)));
        } else {
            mess.setType(MessageType.NONDELIVERY);
            service.sendToMessageBroker(mess);
        }
    }
    //            session.sendMessage(new TextMessage(gson.toJson(new ErrorMessage(MessageType.ERROR, "not found userId: " + input.getTargetId()))));

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        System.out.println("Connection closed");
        String userId = getUserId(session);
        sessionManager.removeSession(session, userId);
    }
}
