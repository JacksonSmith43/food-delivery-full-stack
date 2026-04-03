package com.fooddelivery.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.fooddelivery.entity.Order;

public interface OrderRepository extends JpaRepository<Order, Long> {
	// Used by the account/orders view so a user only sees their own order history.
	List<Order> findByDeliverySnapshotUserIdOrderByCreatedAtDesc(Long userId);

	// Native SQL is used on purpose here because PostgreSQL enum columns can fail
	// with parameter binding in derived/JPQL queries (enum vs varchar mismatch).
	// The explicit enum casts keep the query type-safe and stable.
	@Query(value = """
			SELECT *
			FROM orders o
			WHERE o.status IN (
				'PLACED'::order_status_enum,
				'PREPARING'::order_status_enum,
				'OUT_FOR_DELIVERY'::order_status_enum
			)
			""", nativeQuery = true)
	List<Order> findOpenOrders();
}
