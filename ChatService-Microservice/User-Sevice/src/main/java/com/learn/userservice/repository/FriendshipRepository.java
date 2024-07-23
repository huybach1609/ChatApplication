package com.learn.userservice.repository;

import com.learn.userservice.model.Friendship;
import com.learn.userservice.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FriendshipRepository extends JpaRepository<Friendship, Integer> {
    List<Friendship> findByRequestUserOrAddressUser(User requestUser, User addressUser);
}
