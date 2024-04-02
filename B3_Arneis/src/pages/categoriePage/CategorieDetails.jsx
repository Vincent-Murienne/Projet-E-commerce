import { Link, useParams } from "react-router-dom"; // Importing useParams to retrieve URL parameters
import { Data } from '../../services/api';
import { useEffect, useState } from "react";

const CategorieDetails = () => {
    const { categoryId } = useParams(); // Retrieving the category ID from URL parameters
    const [getTopProducts, setTopProducts] = useState([]);
    const [getCategoryImage, setCategoryImage] = useState([]);
    const [getCategoryName, setCategoryName] = useState("");


    useEffect(() => {
        // Using the category ID to dynamically fetch products
        const fetchData = async () => {
            try {
                const response = await Data("category", "getCategory", { table: "products", id: categoryId });
                if (response.success === true) {
                    setTopProducts(response.data);
                    setCategoryImage(response.data[0].category_image_name); 
                    setCategoryName(response.data[0].category_name);       
                    
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
                    <h1>Bienvenue dans la boutique "Àirneis" de la catégorie {getCategoryName}:</h1>
                    <p>
                        Quels que soient vos préférences, vous trouverez des produits originaux et colorés qui rehausseront votre décoration.
                    </p>
                    <p>
                        Passez commande dès maintenant sur notre site et recevez vos {getCategoryName.toLowerCase()} chez vous !
                    </p>
                </div>
                <section className="top-produits">
                    <h1 className="heading">Découvrez ici notre gamme de {getCategoryName.toLowerCase()} :</h1>
                    <div className="box-container">
                        {getTopProducts && getTopProducts.map((product) => (
                            <div key={product.id} className="box" >
                                <img src={`/img/${product.product_image_name}`} alt=""/>
                                <div className="card-title">
                                    <h4>{product.name}</h4>
                                    <h4>{product.price}€</h4>
                                </div>
                                <Link to="/produits" className="btn">Voir plus</Link>
                            </div>
                        ))}
                    </div>
                </section>
            </section>
        </>
    );
};

export default CategorieDetails;