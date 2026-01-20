package com.fooddelivery.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "restaurants")
public class Restaurants {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "restaurant")
    private String restaurantName;

    @Column(name = "category")
    private String category;

    public Restaurants() {
    }

    public Restaurants(Long id, String restaurantName, String category) {
        this.id = id;
        this.restaurantName = restaurantName;
        this.category = category;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRestaurantName() {
        return restaurantName;
    }

    public void setRestaurantName(String restaurantName) {
        this.restaurantName = restaurantName;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    @Override
    public String toString() {
        return "Restaurants{" +
                "id=" + id +
                ", restaurantName='" + restaurantName + '\'' +
                ", category='" + category + '\'' +
                '}';
    }
}