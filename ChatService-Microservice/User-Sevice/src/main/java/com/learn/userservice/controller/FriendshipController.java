package com.learn.userservice.controller;

import com.learn.userservice.dto.UserResponse;
import com.learn.userservice.dto.friendship.AddFriendRequest;
import com.learn.userservice.dto.friendship.AddFriendResponse;
import com.learn.userservice.model.Friendship;
import com.learn.userservice.model.User;
import com.learn.userservice.service.FriendshipService;
import lombok.extern.slf4j.Slf4j;
import org.bouncycastle.math.ec.rfc7748.X448;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@Slf4j
@RestController
@RequestMapping("/api/friendship")
public class FriendshipController {
    @Autowired
    private FriendshipService service;

    @GetMapping("/list")
    public List<UserResponse> getListFriend(@RequestHeader("Authorization") String authorizationHeader) {
        return service.getListFriend(authorizationHeader);
    }
    //{{api-gateway}}/api/friendship/isFriend?userId=38683e47-5379-35e4-8dac-464d643a0073&friendId=200d5354-9fb3-33f6-8e52-35d726ed77cb
    @GetMapping("/isFriend")
    public Boolean isFriend(@RequestParam String userId, @RequestParam String friendId) {
        return service.isFriend(userId, friendId);
    }


    @PostMapping("/addFriend")
    public ResponseEntity<AddFriendResponse> addFriend(@RequestBody AddFriendRequest request) {
        return ResponseEntity.ok(service.addFriend(request));
    }


    //curl --location 'http://localhost:8080/api/friendship/ACCEPTED?sender=38683e47-5379-35e4-8dac-464d643a0073' \
    // get friend follow status - use_id
    // type address / request / both
    @GetMapping("/list/{status}")
    public List<UserResponse> getListFriend1(@PathVariable String status, @RequestParam String sender, @RequestParam String type) {
        System.out.println("status: " + status + " sender: " + sender);
        return service.getListFriendByStatus(sender, status, type);
    }

    // update friend status
    // can not update status if person who block is 'to'
    @PostMapping("/action/send-request")
    public String sendRequestFriend(@RequestBody AddFriendRequest request) {
        return service.handleRequest(request);
    }

    // accept - friend request
    @PutMapping("/action/accept-request")
    public String responseFriend(@RequestBody AddFriendRequest request) {
        return service.handleAcceptStatus(request);
    }

     // block - friend request
    // friendship/action/block?requestId=&addressId=
    @PutMapping("/action/block")
    public String blockFriend(@RequestParam String requestId, @RequestParam String addressId) {
        return service.blockFriend(requestId, addressId);
    }
       // unblock - friend request
    @PutMapping("/action/unblock")
    public String unBlockFriend(@RequestParam String requestId, @RequestParam String addressId) {
        log.info("requestId {}, addressId {}", requestId, addressId);
        return service.unBlockFriend(requestId, addressId);
    }

    // delete friendship
    // /api/friendship?requestId=?&addressId=
    @DeleteMapping()
    public String deleteFriendShip(@RequestParam String requestId, @RequestParam String addressId){
        return service.handleDelete(requestId, addressId);

    }


    @GetMapping("/lastedMessage/{sender}")
    public List<FriendMessageResponses> getListFriendAddMessage(@PathVariable String sender) {
        return service.getListFriendAddMessage(sender);
    }

}
