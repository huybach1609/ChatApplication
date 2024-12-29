package com.learn.userservice.model;

import com.learn.userservice.enums.ConnectionStatus;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
@Entity
public class User {
    @Id
    private String id;
    private String username;
    private String password;
    private String email;
    private String fullName;
    private String picture;
    private ConnectionStatus connectionStatus;
    public User(String id){
       this.id = id;
    }
}
