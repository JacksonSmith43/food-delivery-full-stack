package com.fooddelivery.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fooddelivery.entity.Restaurants;
import com.fooddelivery.repository.RestaurantRepository;

@Service
public class RestaurantsService {
    @Autowired
    private RestaurantRepository restaurantRepository;

    public List<Restaurants> getRestaurantImages() {
    }

}
