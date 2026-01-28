package com.fooddelivery.repository;

import com.fooddelivery.entity.Restaurants;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RestaurantRepository extends JpaRepository<Restaurants, Long> {
    Optional<Restaurants> findByRestaurantName(String restaurantName);
}