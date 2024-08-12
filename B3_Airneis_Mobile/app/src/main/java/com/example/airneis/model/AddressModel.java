package com.example.airneis.model;

public class AddressModel {
    private int addressId, zipCode;
    private String addressName, firstName, lastName, address, city, region, country, phone;

    public AddressModel() {
        this.addressId = -1;
        this.addressName = "";
        this.firstName = "";
        this.lastName = "";
        this.address = "";
        this.city = "";
        this.zipCode = -1;
        this.region = "";
        this.country = "";
        this.phone = "";
    }
    public AddressModel(int addressId, String addressName, String firstName, String lastName, String address, String city, int zipCode, String region, String country, String phone) {
        this.addressId = addressId;
        this.addressName = addressName;
        this.firstName = firstName;
        this.lastName = lastName;
        this.address = address;
        this.city = city;
        this.zipCode = zipCode;
        this.region = region;
        this.country = country;
        this.phone = phone;
    }

    public int getAddressId() {
        return addressId;
    }

    public int getZipCode() {
        return zipCode;
    }

    public String getAddressName() {
        return addressName;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getAddress() {
        return address;
    }

    public String getCity() {
        return city;
    }

    public String getRegion() {
        return region;
    }

    public String getCountry() {
        return country;
    }

    public String getPhone() {
        return phone;
    }
}
