package com.fooddelivery.repository;

import com.fooddelivery.entity.Restaurants;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RestaurantRepository extends JpaRepository<Restaurants, Long> {
    Optional<Restaurants> findByRestaurantName(String restaurantName);
}