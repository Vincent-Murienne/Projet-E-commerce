package com.example.airneis.model;

public class ProductModel {
    private int productId;
    private String productName, imageName;
    private double productPrice;

    public ProductModel(int productId, String productName, String imageName) {
        this.productId = productId;
        this.productName = productName;
        this.imageName = imageName;
    }

    public ProductModel(int productId, String productName, String imageName, double productPrice) {
        this.productId = productId;
        this.productName = productName;
        this.imageName = imageName;
        this.productPrice = productPrice;
    }

    public int getProductId() {
        return productId;
    }

    public String getProductName() {
        return productName;
    }

    public String getImageName() {
        return imageName;
    }
    public double getProductPrice() {
        return productPrice;
    }
}
