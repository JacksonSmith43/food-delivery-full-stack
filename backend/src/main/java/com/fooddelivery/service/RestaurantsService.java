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
        System.out.println("RestaurantsService_getRestaurantImages().");

        List<Restaurants> restaurants = restaurantRepository.findAll();

        if (restaurants.isEmpty()) {
            List.of();
        }

        System.out.println("RestaurantsService_getRestaurantImages_restaurants: " + restaurants);
        return restaurants.stream().toList();
    }

}
