package com.example.airneis.model;

public class CategoryData {
    private int id;
    private String name;
    private String imageName;

    public CategoryData(int id, String name, String imageName) {
        this.id = id;
        this.name = name;
        this.imageName = imageName;
    }

    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getImageName() {
        return imageName;
    }
}
