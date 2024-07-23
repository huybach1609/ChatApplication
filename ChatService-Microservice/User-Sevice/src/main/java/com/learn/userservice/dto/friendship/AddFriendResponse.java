package com.learn.userservice.dto.friendship;

import com.learn.userservice.enums.FriendshipStatus;
import lombok.Builder;
import lombok.Data;

import java.util.Date;

@Data
@Builder
public class AddFriendResponse {
    private String  requestUser;
    private String addressUser;
    private Date createAt;
    private FriendshipStatus status;
}
