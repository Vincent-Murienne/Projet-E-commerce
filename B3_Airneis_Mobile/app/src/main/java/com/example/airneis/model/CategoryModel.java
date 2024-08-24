package com.example.airneis.model;

public class CategoryModel {
    private int categoryId;
    private String categoryName, imageName;

    public CategoryModel(int categoryId, String categoryName, String imageName) {
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
