package com.example.airneis.model;

public class MaterialModel {
    private int materialId;
    private String materialName;

    public MaterialModel(int materialId, String materialName) {
        this.materialId = materialId;
        this.materialName = materialName;
    }

    public int getMaterialId() {
        return materialId;
    }

    public String getMaterialName() {
        return materialName;
    }

}
