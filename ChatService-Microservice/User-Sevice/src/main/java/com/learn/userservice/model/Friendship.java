package com.learn.userservice.model;

import com.learn.userservice.enums.FriendshipStatus;
import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;

import java.util.Date;

@Data
@Entity
@ToString
public class Friendship {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @ManyToOne
    private User requestUser;
    @ManyToOne
    private User addressUser;
    private Date createAt;
    private FriendshipStatus status;
}
