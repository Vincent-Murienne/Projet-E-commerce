import { useTranslation } from 'react-i18next';

const AirneisDesc = () => {
    const { t } = useTranslation();

    return (
        <div className="about-us-container">
            <h1>{t('aboutUs')}</h1>
            <div className="about-us-content">
                <p>
                    <strong>{t('airneis')}</strong> {t('airneisDescription')}
                </p>
                <p>
                    {t('passion')}
                </p>
                <p>
                    {t('digitalEra')}
                </p>
                <h2>{t('ourMission')}</h2>
                <p>
                    {t('missionDescription')}
                </p>
                <h2>{t('ourValues')}</h2>
                <ul>
                    <li><strong>{t('quality')}:</strong> {t('qualityDescription')}</li>
                    <li><strong>{t('design')}:</strong> {t('designDescription')}</li>
                    <li><strong>{t('service')}:</strong> {t('serviceDescription')}</li>
                    <li><strong>{t('sustainability')}:</strong> {t('sustainabilityDescription')}</li>
                </ul>
            </div>
        </div>
    );
};

export default AirneisDesc;
