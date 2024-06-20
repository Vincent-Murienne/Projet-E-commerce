import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import frTranslation from '../locales/fr.json';
import enTranslation from '../locales/en.json';
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
            ar: {
                translation: arTranslation
            },
            he: {
                translation: heTranslation
            }
        },
        lng: 'fr', // langue par défaut
        fallbackLng: 'en', // langue de repli si la traduction n'est pas disponible
        interpolation: { escapeValue: false } // réagir aux valeurs échappées
    });

export default i18n;
