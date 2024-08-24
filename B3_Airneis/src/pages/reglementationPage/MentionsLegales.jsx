import { useTranslation } from 'react-i18next';

const MentionsLegales = () => {
    const { t } = useTranslation();

    return (
        <div className="cgu-container">
            <h1>{t('legalNotice')}</h1>
            <section>
                <h2>{t('identificationTitle')}</h2>
                <p>{t('identificationContent1')}</p>
                <p><strong>{t('companyName')}</strong></p>
                <p>{t('headquarters')}</p>
                <p>{t('contactMail')}</p>
                <p>{t('sitePhoneNumber')}</p>
            </section>         
            <section>
                <h2>{t('personalDataTitle')}</h2>
                <p>{t('personalDataContent1')}</p>
                <p>{t('personalDataContent2')}</p>
                <p>{t('personalDataContent3')}</p>
            </section>      
        </div>
    );
};

export default MentionsLegales;
