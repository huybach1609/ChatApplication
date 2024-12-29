package com.learn.userservice.dto.friendship;

import com.learn.userservice.enums.FriendshipStatus;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AddFriendRequest {
    // who send request to be friend
    private String request;
    // who replies to request
    private String address;
    private FriendshipStatus status;

}
