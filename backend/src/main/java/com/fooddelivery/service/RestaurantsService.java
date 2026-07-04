package com.fooddelivery.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.fooddelivery.entity.Restaurants;
import com.fooddelivery.repository.RestaurantRepository;

@Service
public class RestaurantsService {
    private RestaurantRepository restaurantRepository;

    public RestaurantsService(RestaurantRepository restaurantRepository) {
        this.restaurantRepository = restaurantRepository;
    }

    public List<Restaurants> getRestaurantImages() {
        System.out.println("RestaurantsService_getRestaurantImages().");

        List<Restaurants> restaurants = restaurantRepository.findAll();

        if (restaurants.isEmpty()) {
            return List.of();
        }

        System.out.println("RestaurantsService_getRestaurantImages_restaurants: " + restaurants);
        return restaurants.stream().toList();
    }

}
