package com.learn.userservice.handle;

import com.learn.userservice.dto.AuthenticationResponse;
import com.learn.userservice.dto.ErrorResponse;
import com.learn.userservice.exception.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class CustomExceptionHandler {
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleBadCredentialsException() {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorResponse(HttpStatus.BAD_REQUEST,"Incorrect username or password"));
    }

    @ExceptionHandler(UsernameNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleUsernameNotFoundException() {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorResponse(HttpStatus.BAD_REQUEST,"User not found"));
    }
    @ExceptionHandler(IdMismatchException.class)
    public ResponseEntity<ErrorResponse> handleIdMismatchException(IdMismatchException e) {
        return ResponseEntity.status(e.getStatus()).body(new ErrorResponse(e.getStatus(), e.getMessage()));

    }
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFoundException(ResourceNotFoundException e) {
        return ResponseEntity.status(e.getStatus()).body(new ErrorResponse(e.getStatus(), e.getMessage()));
    }

    @ExceptionHandler(JwtAuthenticationException.class)
    public ResponseEntity<String> handleJwtAuthenticationException(JwtAuthenticationException ex) {
        return new ResponseEntity<>(ex.getMessage(), ex.getStatus());
    }
    @ExceptionHandler(WrongUsernameException.class)
    public ResponseEntity<?> handleWrongUsernameException(WrongUsernameException ex) {
        return new ResponseEntity<>(AuthenticationResponse.builder()
                .message(ex.getMessage())
                .jwt("0")
                .build(), HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(WrongPasswordException.class)
    public ResponseEntity<?> handleWrongPasswordException(WrongPasswordException ex) {
        return new ResponseEntity<>(AuthenticationResponse.builder()
                .message(ex.getMessage())
                .jwt("1")
                .build(), HttpStatus.UNAUTHORIZED);
    }


}
