package com.learn.userservice.repository;

import com.learn.userservice.enums.FriendshipStatus;
import com.learn.userservice.model.Friendship;
import com.learn.userservice.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FriendshipRepository extends JpaRepository<Friendship, Integer> {
    @Query("SELECT f FROM Friendship f WHERE " +
            "(f.requestUser = :user1 AND f.addressUser = :user2) OR " +
            "(f.requestUser = :user2 AND f.addressUser = :user1)")
    Friendship findBidirectionalFriendship(@Param("user1") User user1, @Param("user2") User user2);
    Friendship findByRequestUserAndAddressUser(User requestUser, User addressUser);

    List<Friendship> findByRequestUserOrAddressUser(User requestUser, User addressUser);

    @Query("SELECT f FROM Friendship f WHERE f.addressUser = :user1 and f.status = :status")
    List<Friendship> findFriendshipStatusAddressUser(@Param("user1") User addressUser,@Param("status") FriendshipStatus status);

    @Query("SELECT f FROM Friendship f WHERE f.requestUser = :user1 and f.status = :status")
    List<Friendship> findFriendshipStatusRequestUser(@Param("user1") User requestUser,@Param("status") FriendshipStatus status);
}
