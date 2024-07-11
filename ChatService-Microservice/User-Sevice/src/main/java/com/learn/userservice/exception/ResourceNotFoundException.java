package com.learn.userservice.exception;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

//@ResponseStatus(HttpStatus.NOT_FOUND)
@Getter
@Setter
public class ResourceNotFoundException extends RuntimeException{
    private HttpStatus status;
    private String message;
    public ResourceNotFoundException() {
        super();
    }

    public ResourceNotFoundException(HttpStatus status, String message) {
        super(message);
        this.status = status;
        this.message= message;
    }
    public ResourceNotFoundException(HttpStatus status, String message, String message1) {
        super(message);
        this.status = status;
        this.message= message1;
    }

    public ResourceNotFoundException(Throwable cause){
           super(cause);
    }


}