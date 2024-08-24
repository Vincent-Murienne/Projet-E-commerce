import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const MonComptePage = () => {
    const { t } = useTranslation();

    return (
        <div className="mainMonCompte">
            <div className="buttons-container-monCompte">
                <Link to="/monCompteParametres" className="btn-monCompte btn-primary-monCompte">{t('accountSettings')}</Link>
                <Link to="/myOrdersPage" className="btn-monCompte btn-secondary-monCompte">{t('myOrders')}</Link>
            </div>
        </div>
    );  
};

export default MonComptePage;