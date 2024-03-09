import { Link } from "react-router-dom";
import { getData } from '../../services/api';
import { useEffect, useState } from "react";

const TopProduits = () => {

    const [getTopProducts, setTopProducts] = useState([]);

    let data = {
        "table": "products",
        "category_id": 1    
    };

    useEffect(() => {
        getData("getTop", data).then(response => {
            if (response.success === true)
            {
                console.log(response);
                setTopProducts(response.data);
            }
            else
            {
                console.log(response.error);
            }
        });
    }, []);
    const handleMouseEnter = () => {
        console.log("La souris survole la carte");
    };
    const handleMouseLeave = () => {
        console.log("La souris quitte la carte");
    };

    const description = (
        <div className="description-centre">
            <h1>Bienvenue dans la boutique "Àrneis" de la catégorie Chaise:</h1>
            <p>
                Quels que soient vos préférences, vous trouverez des produits originaux et colorés qui rehausseront votre décoration.
            </p>
            <p>
                Passez commande dès maintenant sur notre site et recevez vos chaises chez vous !
            </p>
        </div>
    );

    return(
        <>
            <img src="/img/1-1-chaise-design-blanc-et-bois-clair-.jpg" alt="Chaise" className="categoriePage-image" />
            {description}
            <section className="top-produits">
                <h1 className="heading">Découvrez ici notre gamme de chaises d'intérieur :</h1>
                <div className="box-container" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                    {getTopProducts && getTopProducts.map((product) => (
                        <div key={product.category_id} className="box" >
                            <img src={`/img/${product.image_name}`} alt=""/>
                            <Link to="/" className="btn">Voir plus</Link>
                            <div className="card-title">
                            <h4>{product.product_name}</h4>
                            <h4>90€</h4>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </>
    );
};

export default TopProduits;