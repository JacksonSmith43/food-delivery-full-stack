package com.fooddelivery.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fooddelivery.entity.Address;

public interface AddressRepository extends JpaRepository<Address, Long> {

}
