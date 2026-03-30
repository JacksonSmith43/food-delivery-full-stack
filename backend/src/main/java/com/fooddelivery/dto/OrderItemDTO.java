package com.fooddelivery.dto;

import java.math.BigDecimal;

public class OrderItemDTO {
    private Integer quantity;
    private BigDecimal price;
    private String menuItemNameSnapshot;

    public OrderItemDTO() {

    }

    public OrderItemDTO(Integer quantity, BigDecimal price, String menuItemNameSnapshot) {
        this.quantity = quantity;
        this.price = price;
        this.menuItemNameSnapshot = menuItemNameSnapshot;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public String getMenuItemNameSnapshot() {
        return menuItemNameSnapshot;
    }

    public void setMenuItemNameSnapshot(String menuItemNameSnapshot) {
        this.menuItemNameSnapshot = menuItemNameSnapshot;
    }

    @Override
    public String toString() {
        return "OrderItemDTO [quantity=" + quantity + ", price=" + price + ", menuItemNameSnapshot="
                + menuItemNameSnapshot + "]";
    }
}
