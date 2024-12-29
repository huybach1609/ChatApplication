package com.learn.userservice.service;

import com.learn.commonservice.dto.MessageSendEvent;
import com.learn.userservice.controller.FriendMessageResponses;
import com.learn.userservice.dto.UserResponse;
import com.learn.userservice.dto.friendship.AddFriendRequest;
import com.learn.userservice.dto.friendship.AddFriendResponse;
import com.learn.userservice.enums.FriendshipStatus;
import com.learn.userservice.exception.IdMismatchException;
import com.learn.userservice.exception.ResourceNotFoundException;
import com.learn.userservice.model.Friendship;
import com.learn.userservice.model.User;
import com.learn.userservice.repository.FriendshipRepository;
import com.learn.userservice.repository.UserRepository;
import com.learn.userservice.utils.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Date;
import java.util.List;
import java.util.Objects;

@Service
public class FriendshipService {
    private static final Logger log = LoggerFactory.getLogger(FriendshipService.class);
    private final UserRepository userRepository;
    private final FriendshipRepository friendshipRepository;
    private final JwtUtil jwtUtil;
    private final RestTemplate restTemplate;

    public FriendshipService(FriendshipRepository friendshipRepository, UserRepository userRepository, JwtUtil jwtUtil, RestTemplate restTemplate) {
        this.friendshipRepository = friendshipRepository;
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.restTemplate = restTemplate;
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

        return toUserResponse(list, user, FriendshipStatus.ACCEPTED);
    }

    public List<FriendMessageResponses> getListFriendAddMessage(String sender) {

        User user = userRepository.findByUsername(sender).orElseThrow(() -> new IdMismatchException(HttpStatus.UNAUTHORIZED, "Not found user "));

        // get userId which is friend of sender
        List<Friendship> list = friendshipRepository.findByRequestUserOrAddressUser(user, user);
        List<UserResponse> userResponses = toUserResponse(list, user, FriendshipStatus.ACCEPTED);
        List<String> listStringFriend = userResponses.stream().map(UserResponse::getId).toList();

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Type", "application/json");

        HttpEntity<List<String>> entity = new HttpEntity<>(listStringFriend, headers);

        ResponseEntity<List<MessageSendEvent>> response = restTemplate.exchange(
                "http:message-service/api/message",
                HttpMethod.POST,
                entity,
                new ParameterizedTypeReference<List<MessageSendEvent>>() {
                }
        );

        return null;
    }

    // get list friend follow status
    public List<UserResponse> getListFriendByStatus(String sender, String status, String type) {
        FriendshipStatus statusTo;
        try {
            statusTo = FriendshipStatus.valueOf(status);
        } catch (Exception e) {
            throw new IdMismatchException(HttpStatus.BAD_REQUEST, e.getMessage());
        }

        User user = new User(sender);

        log.info("status {}", statusTo.toString());
        List<Friendship> listDb = null;
        if (type.equalsIgnoreCase("address")) {
            listDb = friendshipRepository.findFriendshipStatusAddressUser(user, statusTo);
        } else if (type.equalsIgnoreCase("request")) {
            listDb = friendshipRepository.findFriendshipStatusRequestUser(user, statusTo);
        } else {
            throw new IdMismatchException(HttpStatus.BAD_REQUEST, "type just get 'address' or 'request'");
        }
        assert listDb != null;
        return toUserResponse(listDb, user, statusTo);
    }


    public List<UserResponse> toUserResponse(List<Friendship> list, User user, FriendshipStatus status) {
        return list.stream()
                .filter(friendship -> friendship.getStatus() == status)
                .map(friendship -> {
                    UserResponse userResponse = new UserResponse();

                    User friend = friendship.getRequestUser().getId().equals(user.getId()) ? friendship.getAddressUser() : friendship.getRequestUser();

                    BeanUtils.copyProperties(friend, userResponse);
                    return userResponse;
                })
                .toList();
    }

    public String handleRequest(AddFriendRequest request) {
        // check that friendship has in db
        Friendship fsDbs = friendshipRepository.findBidirectionalFriendship(
                new User(request.getAddress()), new User(request.getRequest())
        );

        log.info("handleRequest: fsdbs {}", fsDbs);

        Friendship friendship;
        if (fsDbs != null) {
//            friendship = fsDbs;
            return switch (fsDbs.getStatus()) {
                case ACCEPTED -> " you already are their friend. Can not send request for this user";
                case BLOCKED -> "you are blocked. Can not send request for this user";
                case PENDING -> "you already are their friend. Can not send request for this user";
                default -> "You might have already sent a request or you are blocked";
            };
        } else {
            friendship = Friendship.builder()
                    .requestUser(new User(request.getRequest()))
                    .addressUser(new User(request.getAddress()))
                    .status(FriendshipStatus.PENDING)
                    .createAt(new Date())
                    .build();
        }
        friendshipRepository.save(friendship);
        return "Send request success";

        // if in block relationship / return announce can not send request
        // status different with i
    }

    // if it's in pending go with function
    public String handleAcceptStatus(AddFriendRequest request) {
        Friendship fsDbs = friendshipRepository.findByRequestUserAndAddressUser(
                new User(request.getRequest()), new User(request.getAddress())
        );

        if (request.getStatus() == null) {
            throw new ResourceNotFoundException(HttpStatus.BAD_REQUEST, "FriendShip status is empty");
        }
        return switch (fsDbs.getStatus()) {
            case ACCEPTED -> "you already are their friend. Can not response this user";
            case BLOCKED -> "you already blocked. Can response to  this user";
            case PENDING -> {
                fsDbs.setStatus(FriendshipStatus.ACCEPTED);
                friendshipRepository.save(fsDbs);
                yield "Accept success " + request.getRequest();
            }
            default -> "Unknown status.";
        };
    }

    public Boolean isFriend(String userId, String friendId) {
        Friendship fsDbs = friendshipRepository.findBidirectionalFriendship(
                new User(userId), new User(friendId)
        );
        if (fsDbs != null) {
            System.out.println(fsDbs);
            return true;
        }
        return false;
    }

    public String handleDelete(String requestId, String addressId) {
        Friendship fsDbs = friendshipRepository.findBidirectionalFriendship(
                new User(requestId), new User(addressId)
        );
        if (fsDbs == null) {
            return "Not found that friendShip";
        }
        friendshipRepository.delete(fsDbs);
        return "Delete friendShip success";
    }

    public String blockFriend(String requestId, String addressId) {
        Friendship fsDbs = friendshipRepository.findBidirectionalFriendship(
                new User(requestId), new User(addressId)
        );
        if (fsDbs == null) {
            return "Not found that friendShip";
        }
        String address = fsDbs.getAddressUser().getId().equals(addressId) ? fsDbs.getAddressUser().getFullName() : fsDbs.getRequestUser().getFullName();

        fsDbs.setStatus(FriendshipStatus.BLOCKED);
        fsDbs.setRequestUser(new User(requestId));
        fsDbs.setAddressUser(new User(addressId));
        friendshipRepository.save(fsDbs);
        return "Block " + address + " success";
    }

    public String unBlockFriend(String requestId, String addressId) {
        Friendship fsDbs = friendshipRepository.findByRequestUserAndAddressUser(
                new User(requestId), new User(addressId)
        );
        if (fsDbs == null) {
            return "Not found that friendShip";
        }

        String address = fsDbs.getAddressUser().getId().equals(addressId) ? fsDbs.getAddressUser().getFullName() : fsDbs.getRequestUser().getFullName();

//        fsDbs.setStatus(FriendshipStatus.ACCEPTED);
//        friendshipRepository.save(fsDbs);
        friendshipRepository.delete(fsDbs);
        return "Unblock " + address + " success";
    }
}
