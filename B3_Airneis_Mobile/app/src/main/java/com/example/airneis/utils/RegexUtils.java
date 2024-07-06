package com.example.airneis.utils;

import java.util.regex.Pattern;

public class RegexUtils {
    private static final Pattern FULL_NAME_PATTERN = Pattern.compile("^[a-zA-ZÀ-ÿ\\s-]{5,50}$");
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[^\\s@]{1,50}@[^\\s@]+\\.[^\\s@]+$");
    private static final Pattern PASSWORD_PATTERN = Pattern.compile("^(?=.*[a-zA-Z])(?=.*\\d)[a-zA-Z\\d@#$%^&*()-_+=!]{12,30}$");

    public static boolean isValidFullName(String fullName) {
        return FULL_NAME_PATTERN.matcher(fullName).matches();
    }

    public static boolean isValidEmail(String email) {
        return EMAIL_PATTERN.matcher(email).matches();
    }

    public static boolean isValidPassword(String password) {
        return PASSWORD_PATTERN.matcher(password).matches();
    }
}
