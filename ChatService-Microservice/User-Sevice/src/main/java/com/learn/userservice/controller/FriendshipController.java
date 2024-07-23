package com.learn.userservice.controller;

import com.learn.userservice.dto.UserResponse;
import com.learn.userservice.dto.friendship.AddFriendRequest;
import com.learn.userservice.dto.friendship.AddFriendResponse;
import com.learn.userservice.service.FriendshipService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/friendship")
public class FriendshipController {
    @Autowired
    private FriendshipService service;

    @PostMapping("/addFriend")
    private ResponseEntity<AddFriendResponse> addFriend(@RequestBody AddFriendRequest request) {
        return ResponseEntity.ok(service.addFriend(request));
    }

    @GetMapping
    private List<UserResponse> getListFriend(@RequestHeader("Authorization") String authorizationHeader){
        return service.getListFriend(authorizationHeader);
    }

}
