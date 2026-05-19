package com.fooddelivery.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.fooddelivery.entity.Restaurants;
import com.fooddelivery.repository.RestaurantRepository;

@ExtendWith(MockitoExtension.class)
public class RestaurantServiceTest {

    @Mock
    private RestaurantRepository restaurantRepository;

    @InjectMocks
    private RestaurantsService restaurantsService;

    @Test
    void getRestaurantImages_shouldReturnRestaurants() {
        // Given
        List<Restaurants> mockList = List.of(new Restaurants(), new Restaurants());
        when(restaurantRepository.findAll()).thenReturn(mockList);

        // When
        List<Restaurants> result = restaurantsService.getRestaurantImages();

        // Then
        assertEquals(mockList, result);
        assertEquals(2, result.size());
        verify(restaurantRepository, times(1)).findAll();
    }

    @Test
    void getRestaurantImages_shouldReturnEmptyList() {
        // Given
        when(restaurantRepository.findAll()).thenReturn(List.of());

        // When
        List<Restaurants> result = restaurantsService.getRestaurantImages();

        // Then
        assertEquals(0, result.size());
        verify(restaurantRepository, times(1)).findAll();
    }
}
