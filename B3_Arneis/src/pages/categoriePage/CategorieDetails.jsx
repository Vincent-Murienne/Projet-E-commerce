import { Link, useParams } from "react-router-dom"; // Import de useParams pour récupérer les paramètres d'URL
import { Data } from '../../services/api';
import { useEffect, useState } from "react";


const CategorieDetails = () => {
    const { categoryId } = useParams(); // Récupération de l'ID de la catégorie depuis les paramètres d'URL

    const [getTopProducts, setTopProducts] = useState([]);
    const [getCategoryImage, setCategoryImage] = useState([]);


    useEffect(() => {
        // Utilisation de l'ID de la catégorie pour récupérer les produits dynamiquement
        const fetchData = async () => {
            try {
                const response = await Data("category", "getCategory", { table: "products", id: categoryId });
                if (response.success === true) {
                    setTopProducts(response.data);
                    setCategoryImage(response.data[0].category_image_name);
                } else {
                    console.log(response.error);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [categoryId]);

    return(
        <>  
            <section className="categoriePage">
                <img src={`/img/${getCategoryImage}`} alt="Image de catégorie" className="categoriePage-image"/>
                <div className="description-centre">
                <h1>Bienvenue dans la boutique "Àrneis" de la catégorie Chaise:</h1>
                <p>
                    Quels que soient vos préférences, vous trouverez des produits originaux et colorés qui rehausseront votre décoration.
                </p>
                <p>
                    Passez commande dès maintenant sur notre site et recevez vos chaises chez vous !
                </p>
            </div>
                <section className="top-produits">
                    <h1 className="heading">Découvrez ici notre gamme de chaises d'intérieur :</h1>
                    <div className="box-container">
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
            </section>
        </>
    );
};

export default CategorieDetails;