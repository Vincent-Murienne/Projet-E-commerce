import { Link, useParams } from "react-router-dom";
import { Data } from '../../services/api';
import { useEffect, useState } from "react";

const ProductSimilaire = ({ categoryId, productId }) => {
    const [getTopProducts, setTopProducts] = useState([]);
    
    useEffect(() => {
        // Use the category ID to fetch similar products
        const fetchData = async () => {
            try {
                const response = await Data("product", "getProductSimilaire", { table: "products", id: categoryId });
                if (response.success === true) {
                    setTopProducts(response.data);
                } else {
                    ToastQueue.negative(response.error, {timeout: 5000});
                }
            } catch (error) {
                console.error('Une erreur est survenue lors de la récupération des produits similaires:', error);
            }
        };

        fetchData();
    }, []);

    return(
        <>  
            <section className="categoriePage">               
                <section className="top-produits">
                    <h1 className="heading">PRODUITS SIMILAIRES</h1>
                    <div className="box-container">
                        {getTopProducts && getTopProducts.map((product) => (
                            // Check if the product is different from the current product
                            product.id !== productId && (
                                <div key={product.id} className="box" >
                                    <img src={`/img/${product.product_image_name}`} alt=""/>
                                    <div className="card-title">
                                        <h4>{product.name}</h4>
                                        <h4>{product.price}€</h4>
                                    </div>
                                    <Link to={`/product/${product.id}`} className="btn">Voir plus</Link>
                                </div>
                            )
                        ))}
                    </div>
                </section>
            </section>
        </>
    );
};

export default ProductSimilaire;
