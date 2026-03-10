package com.fooddelivery.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.fooddelivery.entity.Address;

@Repository
public interface AddressRepository extends JpaRepository<Address, Long> {

}
