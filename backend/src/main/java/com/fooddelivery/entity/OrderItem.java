package com.fooddelivery.entity;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer quantity;
    private BigDecimal price;

    @JoinColumn(name = "menu_item_id")
    private Long menuItemId;

    @ManyToOne
    @JoinColumn(name = "order_id")
    private Order order;

    @Column(name = "menu_item_name_snapshot")
    private String menuItemNameSnapshot;

    public OrderItem() {

    }

    public OrderItem(Long id, Long menuItemId, Integer quantity, BigDecimal price) {
        this.id = id;
        this.menuItemId = menuItemId;
        this.quantity = quantity;
        this.price = price;
    }

    public OrderItem(Long id, Integer quantity, BigDecimal price, Long menuItemId, Order order,
            String menuItemNameSnapshot) {
        this.id = id;
        this.quantity = quantity;
        this.price = price;
        this.menuItemId = menuItemId;
        this.order = order;
        this.menuItemNameSnapshot = menuItemNameSnapshot;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getMenuItemId() {
        return menuItemId;
    }

    public void setMenuItemId(Long menuItemId) {
        this.menuItemId = menuItemId;
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

    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order) {
        this.order = order;
    }

    public String getMenuItemNameSnapshot() {
        return menuItemNameSnapshot;
    }

    public void setMenuItemNameSnapshot(String menuItemNameSnapshot) {
        this.menuItemNameSnapshot = menuItemNameSnapshot;
    }

    @Override
    public String toString() {
        return "OrderItem [id=" + id + ", quantity=" + quantity + ", price=" + price + ", menuItemId=" + menuItemId
                + ", order=" + order + ", menuItemNameSnapshot=" + menuItemNameSnapshot + "]";
    }

}
