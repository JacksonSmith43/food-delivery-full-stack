package com.fooddelivery.integration;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.hamcrest.Matchers.hasItem;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import com.fooddelivery.entity.Restaurants;
import com.fooddelivery.repository.RestaurantRepository;

import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class RestaurantIntegrationTest {

    @Autowired
    private MockMvc mockMvc;
    @Autowired
    RestaurantRepository restaurantRepository;

    // This adds a restaurant to the database before each test, so that we have
    // something to retrieve when we call the endpoint. It also ensures that the
    // database is clean before each test, so that we don't have any leftover data
    // from previous tests.
    @BeforeEach
    void setup() {
        Restaurants restaurant = new Restaurants("Test Restaurant", "test.png", "10");
        restaurantRepository.save(restaurant);
    }

    // This requests the /api/restaurants/ endpoint and checks that it returns a 200
    // OK status and that the response contains a restaurant with the name "Test
    // Restaurant". This request goes through the entire stack, from the controller
    // to the service to the repository and back, so it tests that all of those
    // layers are working together correctly.
    @Test
    void getRestaurants_shouldWorkEndToEnd() throws Exception {
        mockMvc.perform(get("/api/restaurants/"))
                .andExpect(status().isOk())
                // Checks whether the response contains a restaurant with the name "Test
                // Restaurant".
                // The $[*].restaurantName part is a JSONPath expression that looks for the
                // restaurantName field in each element of the response array. The hasItem("Test
                // Restaurant") part checks whether any of those restaurantName values is "Test
                // Restaurant".
                .andExpect(jsonPath("$[*].restaurantName").value(hasItem("Test Restaurant")));
    }

}
