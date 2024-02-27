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
        <img src="/img/1-3-chaise-design-blanc-et-bois-clair-.jpg" alt="Chaise" className="categoriePage-image" />
    </div>
    <br/>
    <h2><p className="texte-centre">Chaises</p></h2>
     <br/> 
     <div className="description-centre">
    <h3>Bienvenue dans la boutique "Àrneis" de la catégorie Chaise:</h3>
    <br/>
    <p>
        Découvrez notre sélection de chaises alliant style et confort pour votre espace de vie. <br />
        Commandez ici vos nouvelles chaises d'intérieur. Il y en a pour tous les goûts, profitez de produits originaux très colorés qui sauront
        sublimer votre décoration. <br />
        Passez commande sur notre site et recevez vos chaises ! Explorez dès aujourd'hui notre collection pour trouver la chaise idéale qui reflète votre style et votre personnalité.
    </p>
</div>
    <br/>
    <br/>

<div className="card-container">
    <div className="card" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <img src="/img/1-1-chaise-design-blanc-et-bois-clair-.jpg" className="card-img-top" alt="..." />
        <div className="card-body">
        <button className="btn2">Acheter maintenant</button>  
        </div>
        <br />
        <br />
        <div className="card-title">            
            <h4>Chaise en bois clair</h4>
            <h4>69.99 euro</h4>
        </div>
    </div>
<div className="card">
    <img src="/img/2-2-chaise-pivotante.jpg" className="card-img-top" alt="..." />
    <div className="card-body">
    <button className="btn2">Acheter maintenant</button>
    </div>
    <br />
    <br />
    <div className="card-title">
        <h4>Chaise pivotante</h4>
        <h4>110 euro</h4>
    </div>
</div>
    <div className="card">
        <img src="/img/3-3-Chaise en métal .jpg" className="card-img-top" alt="..." />
        <div className="card-body">
            <button className="btn2">Acheter maintenant</button>      
        </div>
        <br />
        <br />
        <div className="card-title">
            <h4>Chaise en métal</h4>
            <h4>89.99 euro</h4>
        </div>
    </div>
    <div className="card">
        <img src="/img/4-1-Chaise de bar.jpg" className="card-img-top" alt="..." />
        <div className="card-body">
    <button className="btn2">Acheter maintenant</button>
        </div>
        <br />
        <br />
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