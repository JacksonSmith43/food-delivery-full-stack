package com.fooddelivery.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fooddelivery.entity.Order;

public interface OrderRepository extends JpaRepository<Order, Long> {
	Optional<Order> findTopByDeliverySnapshotUserIdOrderByCreatedAtDesc(Long userId);
} 
