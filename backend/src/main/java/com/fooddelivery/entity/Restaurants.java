package com.fooddelivery.entity;

import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.*;

@Entity
@Table(name = "restaurants")
public class Restaurants {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "restaurant")
    private String restaurantName;

    @Column(name = "image")
    private String imageName;

    @Column
    private String plz;

    @ManyToMany
    @JoinTable(name = "restaurant_categories", joinColumns = @JoinColumn(name = "restaurant_id"), inverseJoinColumns = @JoinColumn(name = "categories_id"))
    private Set<Categories> categories = new HashSet<>();

    public Restaurants() {
    }

    public Restaurants(String restaurantName, String imageName, String plz) {
		this.restaurantName = restaurantName;
		this.imageName = imageName;
		this.plz = plz;
	}

	public Restaurants(String restaurantName, String imageName, String plz, Set<Categories> categories) {
		this.restaurantName = restaurantName;
		this.imageName = imageName;
		this.plz = plz;
		this.categories = categories;
	}

	public Restaurants(Long id, String restaurantName, String imageName, String plz) {
        this.id = id;
        this.restaurantName = restaurantName;
        this.imageName = imageName;
        this.plz = plz;
    }

    public String getPlz() {
        return plz;
    }

    public void setPlz(String plz) {
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

    public Set<Categories> getCategories() {
        return categories;
    }

    public void setCategories(Set<Categories> categories) {
        this.categories = categories;
    }

    @Override
    public String toString() {
        return "Restaurants [id=" + id + ", restaurantName=" + restaurantName +
                ", imageName=" + imageName + ", plz=" + plz + "]";
    }
}