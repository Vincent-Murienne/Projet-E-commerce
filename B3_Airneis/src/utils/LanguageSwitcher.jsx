import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import i18n from './i18n';

const LanguageSwitcher = ({ selectedLanguage, onLanguageChange }) => {
    const { t } = useTranslation();

    const handleLanguageChange = (event) => {
        const newLanguage = event.target.value;
        i18n.changeLanguage(newLanguage);
        onLanguageChange(newLanguage);
    };

    return (
        <div>
            <h2>{t('language')}</h2>
            <select value={selectedLanguage} onChange={handleLanguageChange}>
                <option value="fr">Français</option>
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="ru">Русский</option>
                <option value="ar">العربية</option>
                <option value="he">עברית</option>
            </select>
        </div>
    );
};

LanguageSwitcher.propTypes = {
    selectedLanguage: PropTypes.string.isRequired,
    onLanguageChange: PropTypes.func.isRequired,
};

export default LanguageSwitcher;
