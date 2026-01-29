package com.fooddelivery.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.*;

@Entity
@Table(name = "menu_items")
public class MenuItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "food_name")
    private String foodName;

    private String description;
    private Double price;

    @Column(name = "food_image")
    private String foodImage;

    @ManyToOne
    @JoinColumn(name = "restaurant_id")
    // If MenuItem is described, then the restaurant reference will be ignored.
    @JsonBackReference
    private Restaurants restaurant;

    public MenuItem() {

    }

    public MenuItem(Long id, String foodName, String description, Double price, String foodImage) {
        this.id = id;
        this.foodName = foodName;
        this.description = description;
        this.price = price;
        this.foodImage = foodImage;
    }

    public MenuItem(String foodName, String description, Double price, String foodImage) {
        this.foodName = foodName;
        this.description = description;
        this.price = price;
        this.foodImage = foodImage;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFoodName() {
        return foodName;
    }

    public void setFoodName(String foodName) {
        this.foodName = foodName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public String getFoodImage() {
        return foodImage;
    }

    public void setFoodImage(String foodImage) {
        this.foodImage = foodImage;
    }

    public Restaurants getRestaurant() {
        return restaurant;
    }

    public void setRestaurant(Restaurants restaurant) {
        this.restaurant = restaurant;
    }

    @Override
    public String toString() {
        return "MenuItem [id=" + id + ", foodName=" + foodName + ", description=" + description + ", price=" + price
                + ", foodImage=" + foodImage + "]";
    }
}
