package com.learn.userservice.exception;

import lombok.Getter;
import lombok.Setter;
import org.springframework.http.HttpStatus;

@Getter
@Setter
public class IdMismatchException extends RuntimeException{
    private HttpStatus status;
    private String message;
    public IdMismatchException() {
        super();
    }

    public IdMismatchException(HttpStatus status, String message) {
        super(message);
        this.status = status;
        this.message= message;
    }
    public IdMismatchException(HttpStatus status, String message, String message1) {
        super(message);
        this.status = status;
        this.message= message1;
    }

    public IdMismatchException(Throwable cause){
           super(cause);
    }

}