package com.fooddelivery.dto;

import java.math.BigDecimal;

public class FavouriteResponseDTO {
    private Long favouriteId;

    private String menuItemName;
    private String menuItemImage;
    private BigDecimal price;

    private String restaurantName;

    public FavouriteResponseDTO() {

    }

    public FavouriteResponseDTO(Long favouriteId, String menuItemName, String menuItemImage,
            BigDecimal price, String restaurantName) {
        this.favouriteId = favouriteId;
        this.menuItemName = menuItemName;
        this.menuItemImage = menuItemImage;
        this.price = price;
        this.restaurantName = restaurantName;
    }

    public Long getFavouriteId() {
        return favouriteId;
    }

    public void setFavouriteId(Long favouriteId) {
        this.favouriteId = favouriteId;
    }

    public String getMenuItemName() {
        return menuItemName;
    }

    public void setMenuItemName(String menuItemName) {
        this.menuItemName = menuItemName;
    }

    public String getMenuItemImage() {
        return menuItemImage;
    }

    public void setMenuItemImage(String menuItemImage) {
        this.menuItemImage = menuItemImage;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public String getRestaurantName() {
        return restaurantName;
    }

    public void setRestaurantName(String restaurantName) {
        this.restaurantName = restaurantName;
    }

    @Override
    public String toString() {
        return "FavouriteResponseDTO [favouriteId=" + favouriteId + ", menuItemName="
                + menuItemName + ", menuItemImage=" + menuItemImage + ", price=" + price + ", restaurantName="
                + restaurantName + "]";
    }
}
