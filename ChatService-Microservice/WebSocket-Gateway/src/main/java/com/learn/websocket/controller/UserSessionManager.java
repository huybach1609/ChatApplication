package com.learn.websocket.controller;

import lombok.Getter;
import org.springframework.stereotype.Component;

import java.util.*;


@Getter
@Component
public class UserSessionManager {
//    private final Map<String, String > sessions = Collections.synchronizedMap(new HashMap<>());
    private Set<String> users = Collections.synchronizedSet(new HashSet<>());

    public void addSession( String userId) {
        users.add(userId);
    }

    public void removeSession( String userId) {
        users.remove(userId);
    }

    public String getSession(String userId) {
       return users.stream().filter(user -> user.equals(userId)).findFirst().orElse(null);
    }

    public boolean containsSession(String userId){
        return users.contains(userId);
    }
}
