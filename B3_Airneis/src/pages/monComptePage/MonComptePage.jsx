const MonComptePage = () => {

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
                    Paramètres du compte
                </button>
                <button onClick={goToMesCommandesPages} className="btn-monCompte btn-secondary-monCompte">
                    Mes commandes
                </button>
            </div>
        </div>
    );
};

export default MonComptePage;