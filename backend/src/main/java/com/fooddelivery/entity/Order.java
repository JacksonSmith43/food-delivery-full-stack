package com.fooddelivery.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.AttributeOverrides;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "total_amount")
    private Integer totalAmount;

    @Column(name = "total_cost")
    private BigDecimal totalCost;

    private String status;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    private String currency;

    @Column(name = "payment_method")
    private String paymentMethod;

    @Column(name = "payment_status")
    private String paymentStatus;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "name", column = @Column(name = "delivery_name")),
            @AttributeOverride(name = "userId", column = @Column(name = "user_id")),
            @AttributeOverride(name = "phoneNumber", column = @Column(name = "delivery_phone_number")),
            @AttributeOverride(name = "label", column = @Column(name = "delivery_label")),
            @AttributeOverride(name = "streetName", column = @Column(name = "delivery_street_name")),
            @AttributeOverride(name = "postalCode", column = @Column(name = "delivery_postal_code")),
            @AttributeOverride(name = "city", column = @Column(name = "delivery_city")),
            @AttributeOverride(name = "country", column = @Column(name = "delivery_country")),
    })
    private DeliverySnapshot deliverySnapshot;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private List<OrderItem> orderItems;

    public Order() {
    }

    public Order(Long id, Integer totalAmount, BigDecimal totalCost, String status, LocalDateTime createdAt,
            String currency, String paymentMethod, String paymentStatus, DeliverySnapshot deliverySnapshot,
            List<OrderItem> orderItems) {
        this.id = id;
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

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
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

    public DeliverySnapshot getDeliverySnapshot() {
        return deliverySnapshot;
    }

    public void setDeliverySnapshot(DeliverySnapshot deliverySnapshot) {
        this.deliverySnapshot = deliverySnapshot;
    }

    public List<OrderItem> getOrderItems() {
        return orderItems;
    }

    public void setOrderItems(List<OrderItem> orderItems) {
        this.orderItems = orderItems;
    }

    @Override
    public String toString() {
        return "Order [id=" + id + ", totalAmount=" + totalAmount + ", totalCost=" + totalCost + ", status=" + status
                + ", createdAt=" + createdAt + ", currency=" + currency + ", paymentMethod=" + paymentMethod
                + ", paymentStatus=" + paymentStatus + ", deliverySnapshot=" + deliverySnapshot;
    }

}
