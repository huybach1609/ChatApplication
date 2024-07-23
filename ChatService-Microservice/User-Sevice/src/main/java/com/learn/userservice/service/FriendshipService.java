package com.learn.userservice.service;

import com.learn.userservice.dto.UserResponse;
import com.learn.userservice.dto.friendship.AddFriendRequest;
import com.learn.userservice.dto.friendship.AddFriendResponse;
import com.learn.userservice.enums.FriendshipStatus;
import com.learn.userservice.exception.IdMismatchException;
import com.learn.userservice.model.Friendship;
import com.learn.userservice.model.User;
import com.learn.userservice.repository.FriendshipRepository;
import com.learn.userservice.repository.UserRepository;
import com.learn.userservice.utils.JwtUtil;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class FriendshipService {
    private final UserRepository userRepository;
    private final FriendshipRepository friendshipRepository;
    private final JwtUtil jwtUtil;
    private final UserService userService;

    public FriendshipService(FriendshipRepository friendshipRepository, UserRepository userRepository, JwtUtil jwtUtil, UserService userService) {
        this.friendshipRepository = friendshipRepository;
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.userService = userService;
    }

    public AddFriendResponse addFriend(AddFriendRequest request) {
        User requestUse = userRepository.findById(request.getRequest()).orElseThrow(() -> new IdMismatchException(HttpStatus.BAD_REQUEST, "Not found User request"));
        User addressUser = userRepository.findById(request.getAddress()).orElseThrow(() -> new IdMismatchException(HttpStatus.BAD_REQUEST, "Not found User address"));
        Friendship friendship = new Friendship();
        friendship.setRequestUser(requestUse);
        friendship.setAddressUser(addressUser);
        friendship.setCreateAt(new Date());
        friendship.setStatus(FriendshipStatus.ACCEPTED);
        friendshipRepository.save(friendship);
        System.out.println(friendship);
        return AddFriendResponse.builder()
                .requestUser(request.getRequest())
                .addressUser(request.getAddress())
                .createAt(friendship.getCreateAt())
                .status(friendship.getStatus())
                .build();
    }

    public List<UserResponse> getListFriend(String authorizationHeader) {
        String token = authorizationHeader.substring(7);
        String username = jwtUtil.getUsername(token);
        User user = userRepository.findByUsername(username).orElseThrow(() -> new IdMismatchException(HttpStatus.UNAUTHORIZED, "Not found user from token"));
        // find user in column requestUser, addressUser
        List<Friendship> list = friendshipRepository.findByRequestUserOrAddressUser(user, user);

        return list.stream()
                .filter(friendship -> friendship.getStatus() == FriendshipStatus.ACCEPTED)
                .map(friendship -> {
                    UserResponse userResponse = new UserResponse();
                    User friend = friendship.getRequestUser().equals(user) ? friendship.getAddressUser() : friendship.getRequestUser();
                    BeanUtils.copyProperties(friend, userResponse);
                    return userResponse;
                })
                .toList();
    }
}
