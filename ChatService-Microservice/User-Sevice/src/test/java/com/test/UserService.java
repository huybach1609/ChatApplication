package com.test;

import com.learn.userservice.dto.friendship.AddFriendRequest;
import com.learn.userservice.enums.FriendshipStatus;
import com.learn.userservice.model.Friendship;


public class UserService {


    public static void main(String[] args) {
        AddFriendRequest request = AddFriendRequest.builder()
                .address("")
                .status(FriendshipStatus.ACCEPTED)
                .request("")
                .build();

        if(request.getStatus() == null){
            System.out.println("You might have already sent a request or you are blocked");
            return;
        }

        String response =  switch (request.getStatus()) {
            case ACCEPTED -> " you already are their friend. Can not send request for this user";
            case BLOCKED -> "you are blocked. Can not send request for this user";
            case PENDING -> "you already are their friend. Can not send request for this user";
            default -> "You might have already sent a request or you are blocked";
        };
        System.out.println(response);
    }

}
