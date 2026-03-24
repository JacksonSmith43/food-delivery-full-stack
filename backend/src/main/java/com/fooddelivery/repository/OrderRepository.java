package com.fooddelivery.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fooddelivery.entity.Order;

public interface OrderRepository extends JpaRepository<Order, Long> {
} 
