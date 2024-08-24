package com.example.airneis.utils;

import java.util.regex.Pattern;

public class RegexUtils {
    private static final Pattern ADDRESS_PATTERN = Pattern.compile("^.{5,100}$");
    private static final Pattern FULL_NAME_PATTERN = Pattern.compile("^[a-zA-ZÀ-ÿ\\s-]{5,50}$");
    private static final Pattern FIRST_NAME_PATTERN = Pattern.compile("^[a-zA-ZÀ-ÿ\\s-]{3,50}$");
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[^\\s@]{1,50}@[^\\s@]+\\.[^\\s@]+$");
    private static final Pattern PASSWORD_PATTERN = Pattern.compile("^(?=.*[a-zA-Z])(?=.*\\d)[a-zA-Z\\d@#$%^&*()-_+=!]{12,30}$");
    private static final Pattern ZIP_CODE_PATTERN = Pattern.compile("^\\d{5}$");
    private static final Pattern PHONE_PATTERN = Pattern.compile("^\\d{10}$");

    public static boolean isValidAddress(String address) {
        return ADDRESS_PATTERN.matcher(address).matches();
    }

    public static boolean isValidFullName(String fullName) {
        return FULL_NAME_PATTERN.matcher(fullName).matches();
    }

    public static boolean isValidFirstName(String firstName) {
        return FIRST_NAME_PATTERN.matcher(firstName).matches();
    }

    public static boolean isValidEmail(String email) {
        return EMAIL_PATTERN.matcher(email).matches();
    }

    public static boolean isValidPassword(String password) {
        return PASSWORD_PATTERN.matcher(password).matches();
    }

    public static boolean isValidZipCode(String zipCode) {
        return ZIP_CODE_PATTERN.matcher(zipCode).matches();
    }

    public static boolean isValidPhone(String phone) {
        return PHONE_PATTERN.matcher(phone).matches();
    }
}
