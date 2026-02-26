package com.fooddelivery.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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

    @Autowired
    private RestaurantsService restaurantService;

    @GetMapping
    public ResponseEntity<List<Restaurants>> getRestaurantImages() {
        System.out.println("Controller_getRestaurantImages().");

        try {
            System.out.println("Controller_getRestaurantImages()_Alright.");
            List<Restaurants> restaurants = restaurantService.getRestaurantImages();
            System.out.println("Controller_getRestaurantImages()_restaurants" + restaurants);
            return ResponseEntity.ok(restaurants); // Ok 200.

        } catch (Exception e) {
            System.err.println("Controller_getRestaurantImages()_Error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build(); // Error 500.
        }

    }
}
