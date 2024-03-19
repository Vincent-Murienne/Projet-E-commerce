import { Link, useParams } from "react-router-dom"; // Import de useParams pour récupérer les paramètres d'URL
import { Data } from '../../services/api';
import { useEffect, useState } from "react";

const CategorieProduits = () => {
    const { categoryId } = useParams(); // Récupération de l'ID de la catégorie depuis les paramètres d'URL

    const [getTopProducts, setTopProducts] = useState([]);

    useEffect(() => {
        // Utilisation de l'ID de la catégorie pour récupérer les produits dynamiquement
        const fetchData = async () => {
            try {
                const response = await Data("category", "getCategory", { table: "products", id: categoryId });
                if (response.success === true) {
                    console.log(response);
                    setTopProducts(response.data);
                } else {
                    console.log(response.error);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [categoryId]);

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
                        <div key={product.id} className="box" >
                            <img src={`/img/${product.product_image_name}`} alt=""/>
                            <Link to="/" className="btn">Voir plus</Link>
                            <div className="card-title">
                                <h4>{product.name}</h4>
                                <h4>{product.price}€</h4>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </>
    );
};

export default CategorieProduits;