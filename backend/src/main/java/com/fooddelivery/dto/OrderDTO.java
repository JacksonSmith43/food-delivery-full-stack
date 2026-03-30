package com.fooddelivery.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.fooddelivery.entity.DeliverySnapshot;

public class OrderDTO {

    // Order.
    private Integer totalAmount;
    private BigDecimal totalCost;
    private String status;
    private LocalDateTime createdAt;
    private String currency;
    private String paymentMethod;
    private String paymentStatus;

    private DeliverySnapshot deliverySnapshot;
    private OrderItemDTO orderItem;

    public OrderDTO() {

    }

    public OrderDTO(Integer totalAmount, BigDecimal totalCost, String status, LocalDateTime createdAt, String currency,
            String paymentMethod, String paymentStatus, DeliverySnapshot deliverySnapshot, OrderItemDTO orderItem) {
        this.totalAmount = totalAmount;
        this.totalCost = totalCost;
        this.status = status;
        this.createdAt = createdAt;
        this.currency = currency;
        this.paymentMethod = paymentMethod;
        this.paymentStatus = paymentStatus;
        this.deliverySnapshot = deliverySnapshot;
        this.orderItem = orderItem;
    }

    public Integer getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Integer totalAmount) {
        this.totalAmount = totalAmount;
    }

    public BigDecimal getTotalCost() {
        return totalCost;
    }

    public void setTotalCost(BigDecimal totalCost) {
        this.totalCost = totalCost;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public OrderItemDTO getOrderItem() {
        return orderItem;
    }

    public void setOrderItem(OrderItemDTO orderItem) {
        this.orderItem = orderItem;
    }

    public DeliverySnapshot getDeliverySnapshot() {
        return deliverySnapshot;
    }

    public void setDeliverySnapshot(DeliverySnapshot deliverySnapshot) {
        this.deliverySnapshot = deliverySnapshot;
    }

    @Override
    public String toString() {
        return "OrderDTO [totalAmount=" + totalAmount + ", totalCost=" + totalCost + ", status=" + status
                + ", createdAt=" + createdAt + ", currency=" + currency + ", paymentMethod=" + paymentMethod
                + ", paymentStatus=" + paymentStatus + ", deliverySnapshot=" + deliverySnapshot + ", orderItem="
                + orderItem + "]";
    }

}
