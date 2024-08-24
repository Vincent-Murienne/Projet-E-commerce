// Regex to validate the full name
// It has to be between 5 and 100 characters long
export const addressRegex = /^.{5,100}$/; 

// Regex to validate the full name
// It has to be between 5 and 50 characters long
export const fullNameRegex = /^[a-zA-ZÀ-ÿ\s-]{5,50}$/;

// Regex to validate the first name, last name, the city, the region and more
// It has to be between 5 and 50 characters long
export const firstNameRegex = /^[a-zA-ZÀ-ÿ\s-]{3,50}$/;

// Regex to validate the email
export const emailRegex = /^[^\s@]{1,50}@[^\s@]+\.[^\s@]+$/;

// Regex to validate the password
// It has to be 12 characters long with at least 1 letter and 1 number
export const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d@#$%^&*()-_+=!]{12,30}$/;

// Regex to validate the zip code
// It has to be 5 digit long
export const zipCodeRegex = /^\d{5}$/; 

// Regex to validate the phone number
// It has to be 10 digit long
export const phoneRegex = /^\d{10}$/; 