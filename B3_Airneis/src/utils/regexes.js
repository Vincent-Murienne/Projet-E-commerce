// Regex pour valider le nom complet
export const fullNameRegex = /^[a-zA-ZÀ-ÿ\s-]{5,50}$/;

// Regex pour valider l'adresse e-mail
export const emailRegex = /^[^\s@]{1,50}@[^\s@]+\.[^\s@]+$/;

// Regex pour valider le mot de passe
// Le mot de passe doit contenir au moins 12 caractères, dont au moins une lettre et un chiffre
export const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d@#$%^&*()-_+=!]{12,30}$/;