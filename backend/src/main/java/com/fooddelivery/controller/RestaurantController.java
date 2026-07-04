package com.fooddelivery.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fooddelivery.entity.Restaurants;
import com.fooddelivery.service.RestaurantsService;

@RestController
@RequestMapping("/api/restaurants/")
@CrossOrigin(origins = "http://localhost:4200")
public class RestaurantController {

    private final RestaurantsService restaurantService;

    public RestaurantController(RestaurantsService restaurantService) {
        this.restaurantService = restaurantService;
    }

    @GetMapping
    public ResponseEntity<List<Restaurants>> getRestaurantImages() {
        System.out.println("RestaurantController_getRestaurantImages().");
        List<Restaurants> restaurants = restaurantService.getRestaurantImages();

        System.out.println("RestaurantController_getRestaurantImages()_Images fetched.");
        return ResponseEntity.ok(restaurants); // Ok 200.
    }
}
