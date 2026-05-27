package com.fooddelivery.repository;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.boot.jdbc.test.autoconfigure.AutoConfigureTestDatabase;
import org.springframework.test.context.ActiveProfiles;

import com.fooddelivery.entity.Restaurants;

@ActiveProfiles("test")
// Tells spring that the PostgreSQL test database should not be replaced by an
// embedded database (H2, HSQL, Derby).
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@DataJpaTest
public class RestaurantRepositoryTest {
    @Autowired
    private RestaurantRepository restaurantRepository;

    @Test
    public void findSpecificRestaurant_shouldReturnSpecificRestaurant() {
        restaurantRepository.deleteAll();
        Restaurants restaurant = new Restaurants("Test Restaurant", "test.png", "10");
        restaurantRepository.save(restaurant);
        // Only one or zero restaurants with the name "Test Restaurant" should exist in
        // the database. If there are more than one, this test will fail because it will
        // not know which one to return.
        Optional<Restaurants> result = restaurantRepository.findByRestaurantName("Test Restaurant");
        assertTrue(result.isPresent());
        // get() means give me the value inside the Optional. But only if a value is
        // present. If not then an exception will be thrown.
        assertEquals("Test Restaurant", result.get().getRestaurantName());
    }
}
