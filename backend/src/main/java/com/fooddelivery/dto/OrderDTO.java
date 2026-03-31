package com.fooddelivery.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.fooddelivery.entity.DeliverySnapshot;

public class OrderDTO {
    private Long orderId;

    // Order.
    private Integer totalAmount;
    private BigDecimal totalCost;
    private String status;
    private LocalDateTime createdAt;
    private String currency;
    private String paymentMethod;
    private String paymentStatus;

    private DeliverySnapshot deliverySnapshot;
    private List<OrderItemDTO> orderItems;

    public OrderDTO() {

    }

    public OrderDTO(Long orderId, Integer totalAmount, BigDecimal totalCost, String status, LocalDateTime createdAt,
            String currency, String paymentMethod, String paymentStatus, DeliverySnapshot deliverySnapshot,
            List<OrderItemDTO> orderItems) {
        this.orderId = orderId;
        this.totalAmount = totalAmount;
        this.totalCost = totalCost;
        this.status = status;
        this.createdAt = createdAt;
        this.currency = currency;
        this.paymentMethod = paymentMethod;
        this.paymentStatus = paymentStatus;
        this.deliverySnapshot = deliverySnapshot;
        this.orderItems = orderItems;
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
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

    public List<OrderItemDTO> getOrderItems() {
        return orderItems;
    }

    public void setOrderItems(List<OrderItemDTO> orderItems) {
        this.orderItems = orderItems;
    }

    public DeliverySnapshot getDeliverySnapshot() {
        return deliverySnapshot;
    }

    public void setDeliverySnapshot(DeliverySnapshot deliverySnapshot) {
        this.deliverySnapshot = deliverySnapshot;
    }

    @Override
    public String toString() {
        return "OrderDTO [orderId=" + orderId + ", totalAmount=" + totalAmount + ", totalCost=" + totalCost
                + ", status=" + status
                + ", createdAt=" + createdAt + ", currency=" + currency + ", paymentMethod=" + paymentMethod
                + ", paymentStatus=" + paymentStatus + ", deliverySnapshot=" + deliverySnapshot + ", orderItems="
                + orderItems + "]";
    }

}
