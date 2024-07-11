package com.learn.websocket.config;

import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.util.Map;

public class CustomHandshakeInterceptor implements HandshakeInterceptor {

    @Override
    public boolean beforeHandshake(
            org.springframework.http.server.ServerHttpRequest request, 
            org.springframework.http.server.ServerHttpResponse response, 
            WebSocketHandler wsHandler, 
            Map<String, Object> attributes) throws Exception {
        
        if (request instanceof org.springframework.http.server.ServletServerHttpRequest) {
            org.springframework.http.server.ServletServerHttpRequest servletRequest =
                    (org.springframework.http.server.ServletServerHttpRequest) request;
            String userId = servletRequest.getServletRequest().getParameter("userId");
            attributes.put("userId", userId);
        }
        return true;
    }

    @Override
    public void afterHandshake(
            org.springframework.http.server.ServerHttpRequest request, 
            org.springframework.http.server.ServerHttpResponse response, 
            WebSocketHandler wsHandler, 
            Exception exception) {
        // Do nothing
    }
}
