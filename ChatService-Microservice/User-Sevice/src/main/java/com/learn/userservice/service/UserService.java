package com.learn.userservice.service;

import com.learn.userservice.dto.UserResponse;
import com.learn.userservice.model.User;
import com.learn.userservice.dto.UserRegistrationRequest;
import com.learn.userservice.repository.UserRepository;
import com.nimbusds.openid.connect.sdk.claims.UserInfo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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
            throw new RuntimeException("Username already exists");
        }
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
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
        User use = userRepository.findByUsername(username).orElseThrow(()->  new RuntimeException("nothing"));
        UserResponse userResponse = new UserResponse();
        BeanUtils.copyProperties(use, userResponse);
        log.info("userinfo: {}", userResponse);
        return userResponse;
    }
}
