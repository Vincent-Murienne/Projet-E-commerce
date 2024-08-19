import { useTranslation } from 'react-i18next';

const MonComptePage = () => {
    const { t } = useTranslation();

    const goToMonCompteParametres = () => {
        window.location.href = "/monCompteParametres";
    };

    const goToMesCommandesPages = () => {
        window.location.href = "/myOrdersPage";
    } 

    return (
        <div className="mainMonCompte">
            <div className="buttons-container-monCompte">
                <button onClick={goToMonCompteParametres} className="btn-monCompte btn-primary-monCompte">
                    {t('accountSettings')}
                </button>
                <button onClick={goToMesCommandesPages} className="btn-monCompte btn-secondary-monCompte">
                    {t('myOrders')}
                </button>
            </div>
        </div>
    );  
};

export default MonComptePage;