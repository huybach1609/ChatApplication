package com.learn.userservice.service;

import com.learn.userservice.model.User;
import com.learn.userservice.model.UserRegistrationRequest;
import com.learn.userservice.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
@Autowired
    private PasswordEncoder passwordEncoder;
    public User registerUser(UserRegistrationRequest request) {
        if(userRepository.findByUsername(request.getUsername()).isPresent()){
           throw new RuntimeException("Username already exists");
        }
        if (userRepository.findByEmail(request.getEmail()).isPresent()){
            throw new RuntimeException("Email already exists");
        }
       User user = User.builder()
               .id(UUID.nameUUIDFromBytes(request.getUsername().getBytes()).toString())
               .username(request.getUsername())
               .password(passwordEncoder.encode(request.getPassword()))
               .email(request.getEmail())
               .build();

        return userRepository.save(user);
    }
}
