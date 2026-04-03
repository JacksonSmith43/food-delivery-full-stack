package com.fooddelivery.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.hibernate.annotations.ColumnTransformer;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.AttributeOverrides;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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

    public enum Status {
        PLACED,
        PREPARING,
        OUT_FOR_DELIVERY,
        DELIVERED
    };

    // So that the enum is stored as a string in the database, not as an ordinal
    // number.
    @Enumerated(EnumType.STRING)
    // ? is the SQL placeholder for the parameter value that will be passed in when
    // writing to the database. The ::order_status_enum part is a
    // PostgreSQL-specific syntax for casting the parameter to the order_status_enum
    // type. This is necessary because without it, Hibernate might try to bind the
    // enum value as a string or an ordinal, which can cause a type mismatch error
    // since the database expects the specific enum type. By using the column
    // transformer, we ensure that when Hibernate writes the status to the database,
    // it correctly casts it to the order_status_enum type, thus avoiding any
    // binding issues and ensuring type safety.
    @ColumnTransformer(write = "?::order_status_enum")
    @Column(name = "status", columnDefinition = "order_status_enum")
    private Status status;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

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

    // ToMany relationships are typically LAZY by default, so they are not
    // loaded from the database until they are accessed in the code.
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private List<OrderItem> orderItems;

    public Order() {
    }

    public Order(Long id, Integer totalAmount, BigDecimal totalCost, Status status, LocalDateTime createdAt,
            String paymentMethod,
            String paymentStatus, DeliverySnapshot deliverySnapshot, List<OrderItem> orderItems) {
        this.id = id;
        this.totalAmount = totalAmount;
        this.totalCost = totalCost;
        this.createdAt = createdAt;
        this.status = status;
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

    public void setStatus(Status status) {
        this.status = status;
    }

    public Status getStatus() {
        return status;
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
        return "Order [id=" + id + ", totalAmount=" + totalAmount + ", totalCost=" + totalCost + ", status="
                + status + ", createdAt=" + createdAt + ", paymentMethod=" + paymentMethod + ", paymentStatus="
                + paymentStatus + ", deliverySnapshot=" + deliverySnapshot + "]";
    }

}
