package com.example.airneis.model;

public class BasketData {
    private int id;
    private String name;
    private String description;
    private String imageName;
    private int quantity;
    private double price;
    private int stock;

    public BasketData(int id, String name, String description, String imageName, int quantity, double price, int stock) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.imageName = imageName;
        this.quantity = quantity;
        this.price = price;
        this.stock = stock;
    }

    // Getters
    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public String getImageName() {
        return imageName;
    }

    public int getQuantity() {
        return quantity;
    }

    public double getPrice() {
        return price;
    }

    public int getStock() {
        return stock;
    }

    // Setters
    public void setId(int id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setImageName(String imageName) {
        this.imageName = imageName;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public void setStock(int stock) {
        this.stock = stock;
    }
}


