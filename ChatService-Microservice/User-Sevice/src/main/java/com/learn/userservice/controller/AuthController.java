package com.learn.userservice.controller;

import com.learn.userservice.dto.AuthenticationRequest;
import com.learn.userservice.dto.AuthenticationResponse;
import com.learn.userservice.dto.UserResponse;
import com.learn.userservice.exception.IdMismatchException;
import com.learn.userservice.exception.WrongPasswordException;
import com.learn.userservice.exception.WrongUsernameException;
import com.learn.userservice.model.User;
import com.learn.userservice.dto.UserRegistrationRequest;
import com.learn.userservice.service.MyUserDetailsService;
import com.learn.userservice.service.UserService;
import com.learn.userservice.utils.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private static final Logger log = LoggerFactory.getLogger(AuthController.class);
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final MyUserDetailsService myUserDetailsService;
    private final UserService userService;

    @GetMapping("/info")
    public ResponseEntity<?> getInfo() {
        return ResponseEntity.ok("UserController:getInfo");
    }


    @PostMapping("/signIn")
    public ResponseEntity<?> createAuthenticationToken2(@RequestBody AuthenticationRequest authenticationRequest) throws Exception {
        log.info(authenticationRequest.toString());
        UserDetails userDetails = myUserDetailsService.loadUserByUsername(authenticationRequest.getUsername());
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(authenticationRequest.getUsername(), authenticationRequest.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtil.generateToken(userDetails.getUsername());

        return ResponseEntity.ok(AuthenticationResponse.builder().jwt(jwt).build());
    }



    @PostMapping("/login")
    public ResponseEntity<?> createAuthenticationToken(@RequestBody AuthenticationRequest authenticationRequest) throws Exception {
        log.info(authenticationRequest.toString());

        try {

            UserDetails userDetails = myUserDetailsService.loadUserByUsername(authenticationRequest.getUsername());

            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(authenticationRequest.getUsername(), authenticationRequest.getPassword())
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtil.generateToken(userDetails.getUsername());

           UserResponse user = userService.getByUserName(userDetails.getUsername());

            return ResponseEntity.ok(AuthenticationResponse.builder().jwt(jwt)
                            .message(user.getId())
                    .build());
        }catch (UsernameNotFoundException e){
            throw new WrongUsernameException(e.getMessage());
        }catch (BadCredentialsException e){
            throw new WrongPasswordException("wrong password");
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserRegistrationRequest request) {
        try {
            User newUser = userService.registerUser(request);
            return ResponseEntity.ok(newUser);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
