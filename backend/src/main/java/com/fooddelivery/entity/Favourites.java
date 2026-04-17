package com.fooddelivery.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Entity
@Table(name = "favourites")
public class Favourites {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "menu_item_id")
    // So that when a menu item is deleted, all corresponding favourites entries
    // will also be deleted, preventing orphaned records and maintaining referential
    // integrity in the database.
    @OnDelete(action = OnDeleteAction.CASCADE)
    private MenuItem menuItems;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnore
    @OnDelete(action = OnDeleteAction.CASCADE)
    private User user;

    public Favourites() {

    }

    public Favourites(Long id, MenuItem menuItems, User user) {
        this.id = id;
        this.menuItems = menuItems;
        this.user = user;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public MenuItem getMenuItems() {
        return menuItems;
    }

    public void setMenuItems(MenuItem menuItems) {
        this.menuItems = menuItems;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    @Override
    public String toString() {
        return "Favourites [id=" + id + ", menuItems=" + menuItems + "]";
    }
}
