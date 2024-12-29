package com.learn.userservice.dto;


import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.springframework.http.HttpStatus;

@Getter
@Setter
@Builder
public class AuthenticationResponse {
    private String jwt;
    private String message;
}
