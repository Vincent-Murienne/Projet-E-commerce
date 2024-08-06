package com.example.airneis.model;

public class ProduitsData {
    private int productId;
    private String productName;
    private String imageName;
    private Double productPrice;

    public ProduitsData(int productId, String productName, String imageName, Double productPrice) {
        this.productId = productId;
        this.productName = productName;
        this.imageName = imageName;
        this.productPrice= productPrice;
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

    public Double getProductPrice() {
        return productPrice;
    }

}
