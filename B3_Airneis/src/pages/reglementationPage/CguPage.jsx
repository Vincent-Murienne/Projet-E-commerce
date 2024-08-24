import { useTranslation } from 'react-i18next';

const CguPage = () => {
    const { t } = useTranslation();

    return (
        <div className="cgu-container">
            <h1>{t('termsAndConditions')}</h1>
            <section>
                <h2>1. {t('siteUsageConditionsTitle')}</h2>
                <p>{t('siteUsageConditionsContent')}</p>
            </section>
            <section>
                <h2>2. {t('intellectualPropertyTitle')}</h2>
                <p>{t('intellectualPropertyContent1')}</p>
                <p>{t('intellectualPropertyContent2')}</p>
                <p>{t('intellectualPropertyContent3')}</p>
            </section>
            <section>
                <h2>3. {t('siteUsageTitle')}</h2>
                <p>{t('siteUsageContent')}</p>
            </section>
            <section>
                <h2>4. {t('limitationOfLiabilityTitle')}</h2>
                <p>{t('limitationOfLiabilityContent')}</p>
            </section>
            <section>
                <h2>5. {t('termsModificationsTitle')}</h2>
                <p>{t('termsModificationsContent')}</p>
            </section>
            <section>
                <h2>6. {t('applicableLawTitle')}</h2>
                <p>{t('applicableLawContent')}</p>
            </section>
        </div>
    );
};

export default CguPage;
