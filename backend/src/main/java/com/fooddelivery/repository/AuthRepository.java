package com.fooddelivery.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.fooddelivery.entity.Auth;

@Repository
public interface AuthRepository extends JpaRepository<Auth, Long> {
    Auth getByEmail(String email);

    Auth getByPassword(String password);

    List<Auth> findByEmail(String email);
    List<Auth> findByPassword(String password);
}
