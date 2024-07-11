package com.learn.userservice.controller;

import com.learn.userservice.dto.ErrorResponse;
import com.learn.userservice.dto.UserResponse;
import com.learn.userservice.exception.IdMismatchException;
import com.learn.userservice.model.User;
import com.learn.userservice.repository.UserRepository;
import com.learn.userservice.utils.JwtUtil;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("/api/info")
public class InfoController {

    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private UserRepository userRepository;

    @GetMapping("/user")
    public ResponseEntity<?> getUser(@RequestHeader("Authorization") String authorizationHeader) {
            String token = authorizationHeader.substring(7);
            String username = "";
            if (jwtUtil.validateToken(token)) {
                username = jwtUtil.getUsername(token);
            }
            System.out.println(username);
            Optional<User> user = userRepository.findByUsername(username);
            if (user.isEmpty()) {
                throw new IdMismatchException(HttpStatus.NOT_FOUND, "User not found");
            }

            UserResponse userResponse = new UserResponse();
            BeanUtils.copyProperties(user.get(), userResponse);

            return ResponseEntity.ok(userResponse);
    }
}
