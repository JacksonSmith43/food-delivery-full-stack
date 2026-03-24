package com.fooddelivery.dto;

import java.math.BigDecimal;

public class CartSummaryDTO {
    Integer totalQuantity;
    BigDecimal totalCost;
    Integer itemCount;

    public CartSummaryDTO() {

    }

    public CartSummaryDTO(Integer totalQuantity, BigDecimal totalCost, Integer itemCount) {
        this.totalQuantity = totalQuantity;
        this.totalCost = totalCost;
        this.itemCount = itemCount;
    }

    public Integer getTotalQuantity() {
        return totalQuantity;
    }

    public void setTotalQuantity(Integer totalQuantity) {
        this.totalQuantity = totalQuantity;
    }

    public BigDecimal getTotalCost() {
        return totalCost;
    }

    public void setTotalCost(BigDecimal totalCost) {
        this.totalCost = totalCost;
    }

    public Integer getItemCount() {
        return itemCount;
    }

    public void setItemCount(Integer itemCount) {
        this.itemCount = itemCount;
    }

    @Override
    public String toString() {
        return "CartSummaryDTO [totalQuantity=" + totalQuantity + ", totalCost=" + totalCost + ", itemCount="
                + itemCount + "]";
    }
}
