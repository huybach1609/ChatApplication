package com.learn.userservice.dto.friendship;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AddFriendRequest {
    private String request;
    private String address;
}
