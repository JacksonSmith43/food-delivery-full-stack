package com.fooddelivery.entity;

import java.math.BigDecimal;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.*;
import java.util.Arrays;

@Entity
@Table(name = "menu_items")
public class MenuItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "food_name")
    private String foodName;

    private String description;
    private BigDecimal price;

    @Column(name = "food_image")
    private String foodImage;

    // Tells Hibernate that this is not a single value column, but a collection of
    // values stored in a separate table. targetClass specifies the type of the
    // elements. EAGER means the labels are always loaded together with the
    // MenuItem.
    @ElementCollection(targetClass = DietaryLabels.class, fetch = FetchType.EAGER)
    // Specifies the name of the separate table that stores the labels, and which
    // column in that table links back to this MenuItem's id.
    @CollectionTable(name = "menu_item_dietary_labels", joinColumns = @JoinColumn(name = "menu_item_id"))
    // Stores the enum as its String name (e.g. "VEGAN") instead of its ordinal
    // number (e.g. 0). This makes the database values readable and safe to reorder.
    @Enumerated(EnumType.STRING)
    @Column(name = "dietary_labels")
    private List<DietaryLabels> dietaryLabels;

    @ManyToOne
    @JoinColumn(name = "restaurant_id")
    // If MenuItem is described, then the restaurant reference will be ignored.
    @JsonBackReference
    private Restaurants restaurant;

    public enum DietaryLabels {
        VEGAN,
        VEGETARIAN,
        HALAL,
        GLUTEN_FREE,
        NUT_FREE,
        HEARTATTACK_WAITING_TO_HAPPEN
    }

    public MenuItem() {

    }

    public MenuItem(Long id, String foodName, String description, BigDecimal price, String foodImage) {
        this.id = id;
        this.foodName = foodName;
        this.description = description;
        this.price = price;
        this.foodImage = foodImage;
    }

    public MenuItem(String foodName, String description, BigDecimal price, String foodImage,
            List<DietaryLabels> dietaryLabels) {
        this.foodName = foodName;
        this.description = description;
        this.price = price;
        this.foodImage = foodImage;
        this.dietaryLabels = dietaryLabels;
    }

    // Varargs constructor: allows passing one or more dietary labels without
    // needing to manually create a List (e.g. DietaryLabels.VEGAN,
    // DietaryLabels.HALAL).
    // ... dietaryLabels means the method can accept zero or more DietaryLabels
    // arguments, which are treated as an array inside the method.
    public MenuItem(String foodName, String description, BigDecimal price, String foodImage,
            DietaryLabels... dietaryLabels) {
        this.foodName = foodName;
        this.description = description;
        this.price = price;
        this.foodImage = foodImage;
        // Arrays.asList() converts the varargs array to a List.
        this.dietaryLabels = Arrays.asList(dietaryLabels);
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

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
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

    public List<DietaryLabels> getDietaryLabels() {
        return dietaryLabels;
    }

    public void setDietaryLabels(List<DietaryLabels> dietaryLabels) {
        this.dietaryLabels = dietaryLabels;
    }

    @Override
    public String toString() {
        return "MenuItem [id=" + id + ", foodName=" + foodName + ", description=" + description + ", price=" + price
                + ", foodImage=" + foodImage + ", dietaryLabels=" + dietaryLabels + "]";
    }

}
