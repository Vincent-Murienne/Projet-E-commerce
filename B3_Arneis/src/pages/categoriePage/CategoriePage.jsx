import '../../assets/css/categoriePage.css'

const CategoriePage = () => {
    const handleMouseEnter = () => {
        console.log("La souris survole la carte");
    };
    const handleMouseLeave = () => {
        console.log("La souris quitte la carte");
    };
    return (
        <>
    <div>
        <img src="/img/1-1-chaise-design-blanc-et-bois-clair-.jpg" alt="Chaise" className="categoriePage-image" />
    </div>
     
    <div className="description-centre">
    <h1>Bienvenue dans la boutique "Àrneis" de la catégorie Chaise:</h1>
        <p>
            Quels que soient vos préférences, vous trouverez des produits originaux et colorés qui rehausseront votre décoration.
        </p>
        <p>
            Passez commande dès maintenant sur notre site et recevez vos chaises chez vous !
        </p>
        
        <h2>Découvrez ici notre gamme de chaises d'intérieur :</h2>
    </div>

<div className="card-container">
    <div className="card" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <img src="/img/1-3-chaise-design-blanc-et-bois-clair-.jpg" className="card-img-top" alt="..." />
        <div className="card-body">
        <button className="btn2">Voir le produit</button>  
        </div>
        <div className="card-title">            
            <h4>Chaise en bois clair</h4>
            <h4>69.99 euro</h4>
        </div>
    </div>
<div className="card">
    <img src="/img/2-2-chaise-pivotante.jpg" className="card-img-top" alt="..." />
    <div className="card-body">
    <button className="btn2">Voir le produit</button>
    </div>

    <div className="card-title">
        <h4>Chaise pivotante</h4>
        <h4>110 euro</h4>
    </div>
</div>
    <div className="card">
        <img src="/img/3-3-Chaise en métal .jpg" className="card-img-top" alt="..." />
        <div className="card-body">
            <button className="btn2">Voir le produit</button>      
        </div>

        <div className="card-title">
            <h4>Chaise en métal</h4>
            <h4>89.99 euro</h4>
        </div>
    </div>
    <div className="card">
        <img src="/img/4-1-Chaise de bar.jpg" className="card-img-top" alt="..." />
        <div className="card-body">
    <button className="btn2">Voir le produit</button>
        </div>
        <div className="card-title">
            <h4>Chaise de bar </h4>
            <h4>79.99 euro</h4>
        </div>
    </div>
</div>
        </>
    );
};

export default CategoriePage;