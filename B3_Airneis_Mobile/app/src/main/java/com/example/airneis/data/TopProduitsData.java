package com.example.airneis.data;

public class TopProduitsData {
    private int productId;
    private String productName;
    private String imageName;

    public TopProduitsData(int productId, String productName, String imageName) {
        this.productId = productId;
        this.productName = productName;
        this.imageName = imageName;
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
}
