package com.learn.userservice.service;

import com.learn.userservice.dto.UserResponse;
import com.learn.userservice.exception.IdMismatchException;
import com.learn.userservice.model.User;
import com.learn.userservice.dto.UserRegistrationRequest;
import com.learn.userservice.repository.UserRepository;
import com.nimbusds.openid.connect.sdk.claims.UserInfo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.BeanNameAware;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class UserService {
    private static final Logger log = LoggerFactory.getLogger(UserService.class);
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    public User registerUser(UserRegistrationRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new IdMismatchException(HttpStatus.BAD_REQUEST, "Username already exists");
        }
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IdMismatchException(HttpStatus.BAD_REQUEST, "Email already exists");
        }
        User user = User.builder()
                .id(UUID.nameUUIDFromBytes(request.getUsername().getBytes()).toString())
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .email(request.getEmail())
                .fullName(request.getFullName())
                .build();
        return userRepository.save(user);
    }

    public UserInfo getById(String id) {
        return null;
    }

    public UserResponse getByUserName(String username) {
        User use = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("nothing"));
        UserResponse userResponse = new UserResponse();
        BeanUtils.copyProperties(use, userResponse);
        return userResponse;
    }

    public List<UserResponse> findByUsernameOrFullName(String username, String fullName) {
        List<User> users = userRepository.findByUsernameContainsIgnoreCaseOrFullNameContainsIgnoreCase(username, fullName);
        return users.stream().map(item -> {
                    UserResponse userResponse = new UserResponse();
                    BeanUtils.copyProperties(item, userResponse);
                    return userResponse;
                }
        ).toList();
    }

}
