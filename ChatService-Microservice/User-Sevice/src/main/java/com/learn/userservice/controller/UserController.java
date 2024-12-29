package com.learn.userservice.controller;

import com.learn.userservice.dto.UserResponse;
import com.learn.userservice.exception.IdMismatchException;
import com.learn.userservice.model.User;
import com.learn.userservice.repository.UserRepository;
import com.learn.userservice.service.UserService;
import com.learn.userservice.utils.JwtUtil;
import org.apache.coyote.Response;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private UserService userService;

    @GetMapping()
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

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable String id) {
        return ResponseEntity.ok(userService.getById(id));
    }

    @GetMapping("/username/{username}")
    public ResponseEntity<?> getUserByName(@PathVariable String username) {
       return ResponseEntity.ok(userService.getByUserName(username));
    }
    @GetMapping("/find")
    public  ResponseEntity<?> findByUsernameOrFullName(@RequestParam String username, @RequestParam String fullName){
        if ((username == null || username.isBlank()) && (fullName == null || fullName.isBlank())) {
            return ResponseEntity.ok(Collections.emptyList());
        }

       return ResponseEntity.ok(userService.findByUsernameOrFullName(username, fullName));
    }
}
