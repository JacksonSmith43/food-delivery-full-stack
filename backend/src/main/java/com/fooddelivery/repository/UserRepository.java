package com.fooddelivery.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fooddelivery.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
    User getByEmail(String email);

    User getByPassword(String password);

    List<User> findByEmail(String email);

    List<User> findByPassword(String password);
}
