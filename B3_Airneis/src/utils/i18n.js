import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import frTranslation from '../locales/fr.json';
import enTranslation from '../locales/en.json';
import esTranslation from '../locales/es.json';
import ruTranslation from '../locales/ru.json';
import arTranslation from '../locales/ar.json';
import heTranslation from '../locales/he.json';

i18n
    .use(initReactI18next)
    .init({
        resources: {
            fr: {
                translation: frTranslation
            },
            en: {
                translation: enTranslation
            },
            es: {
                translation: esTranslation
            },
            ru: {
                translation: ruTranslation
            },
            ar: {
                translation: arTranslation
            },
            he: {
                translation: heTranslation
            }
        },
        lng: 'fr', // Default language
        fallbackLng: 'en', // Callback language if the default one isn't available
        interpolation: { escapeValue: false }
    });

export default i18n;
