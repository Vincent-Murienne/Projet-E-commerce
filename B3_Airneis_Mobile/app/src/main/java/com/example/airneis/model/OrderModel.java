package com.example.airneis.model;

import java.time.LocalDate;

public class OrderModel {
    private int orderId;
    private LocalDate orderDate;
    private String orderStatus;
    private int totalItems;
    private float totalPrice;

    public OrderModel(int orderId, LocalDate orderDate, String orderStatus, int totalItems, float totalPrice) {
        this.orderId = orderId;
        this.orderDate = orderDate;
        this.orderStatus = orderStatus;
        this.totalItems = totalItems;
        this.totalPrice = totalPrice;
    }

    public int getOrderId() {
        return orderId;
    }

    public LocalDate getOrderDate() {
        return orderDate;
    }

    public String getOrderStatus() {
        return orderStatus;
    }

    public int getTotalItems() {
        return totalItems;
    }

    public float getTotalPrice() {
        return totalPrice;
    }
}
