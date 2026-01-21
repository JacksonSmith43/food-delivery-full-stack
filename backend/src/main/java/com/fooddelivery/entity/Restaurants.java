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

    @Column(name = "image")
    private String imageName;

    @Column
    private String plz;

    public String getPlz() {
        return plz;
    }

    public void setPlz(String plz) {
        this.plz = plz;
    }

    public Restaurants() {
    }

    public Restaurants(Long id, String restaurantName, String category, String imageName, String plz) {
        this.id = id;
        this.restaurantName = restaurantName;
        this.category = category;
        this.imageName = imageName;
        this.plz = plz;
    }

    public String getImageName() {
        return imageName;
    }

    public void setImageName(String imageName) {
        this.imageName = imageName;
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
        return "Restaurants [id=" + id + ", restaurantName=" + restaurantName + ", category=" + category
                + ", imageName=" + imageName + ", plz=" + plz + "]";
    }
}