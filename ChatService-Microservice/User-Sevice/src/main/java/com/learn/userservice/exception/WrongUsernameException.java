package com.learn.userservice.exception;

public class WrongUsernameException extends RuntimeException {
    public WrongUsernameException(String message) {
        super(message);
    }
}