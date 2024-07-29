package com.example.airneis.model;

public class TopCategoriesData {
    private int categoryId;
    private String categoryName;
    private String imageName;

    public TopCategoriesData(int categoryId, String categoryName, String imageName) {
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.imageName = imageName;
    }

    public int getCategoryId() {
        return categoryId;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public String getImageName() {
        return imageName;
    }
}
