package com.fooddelivery.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fooddelivery.entity.Restaurants;

@RestController
@RequestMapping("/api/restaurants/images")
@CrossOrigin(origins = "http://localhost:4200")
public class RestaurantController {

    @Autowired
    private RestaurantController restaurantController;

    @GetMapping
    public ResponseEntity<List<Restaurants>> getRestaurantImages() {
        System.out.println("getRestaurantImages().");

        try {
            System.out.println("getRestaurantImages()_Alright.");
            
        } catch (Exception e) {
            System.err.println("getRestaurantImages()_Error: " + e.getMessage());
        }

    }
}
