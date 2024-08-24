package com.example.airneis.model;

public class ProductModel {
    private int productId, productQuantity;
    private String productName, productDescription, imageName;
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

    public ProductModel(int productId, String productName, String productDescription, String imageName, double productPrice, int productQuantity) {
        this.productId = productId;
        this.productName = productName;
        this.productDescription = productDescription;
        this.imageName = imageName;
        this.productPrice = productPrice;
        this.productQuantity = productQuantity;
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
    public int getProductQuantity() {
        return productQuantity;
    }
    public String getProductDescription() {
        return productDescription;
    }
}
