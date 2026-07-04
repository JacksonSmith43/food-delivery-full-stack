package com.fooddelivery.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fooddelivery.entity.MenuItem;
import java.util.Optional;

public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {
    Optional<MenuItem> findByFoodName(String foodName);
}
