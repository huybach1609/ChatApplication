package com.learn.userservice.repository;

import com.learn.userservice.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, String> {
   Optional<User> findByUsername(String username);
   Optional<User> findByEmail(String email);
   List<User> findByUsernameContainsIgnoreCaseOrFullNameContainsIgnoreCase(String username, String fullName);

}

