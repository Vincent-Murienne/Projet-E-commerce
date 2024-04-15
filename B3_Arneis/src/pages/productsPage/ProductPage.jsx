import { Link, useParams } from "react-router-dom";
import { Data } from '../../services/api';
import { useEffect, useState } from "react";
import SliderProduct from "./SliderProduct";
import ProductSimilaire from "./ProductSimilaire";

const ProductPage = () => {
    const [product, setProduct] = useState(null);
    const { productId } = useParams(); // Récupère l'ID du produit depuis les paramètres d'URL

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await Data("product", "getProductDetail", { table: "products", id: productId });
                if (response.success === true) {
                    setProduct(response.data[0]);
                } else {
                    console.error(response.error);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [productId]);

    const stockStatus = product && (product.quantity === null || product.quantity === 0) ? "Hors stock" : "En stock";

    return (
        <>
            <section className="categoriePage">
                <div className="slider-and-text">
                    <SliderProduct/>
                    {product && (
                        <div className="product-text">
                            <div key={product.id}>
                                <h3>{product.name}</h3>   
                                <div className="stock">
                                    <h3>{stockStatus} </h3>                           
                                </div>                                                 
                                <h2>{product.price} €</h2>                              
                                <h3>{product.description}.</h3>
                                {product.material && (
                                    <h3>Conçu avec un matériau de qualité supérieure, fait de {product.material}.</h3>
                                )}
                            </div>     
                            <Link to={`/product/${product.id}`} className={`btnProduit ${stockStatus === "En stock" ? "" : "disabled"}`}>
                                {stockStatus === "En stock" ? "AJOUTER AU PANIER" : "STOCK ÉPUISÉ"}
                            </Link>
                        </div>                   
                    )}
                </div>
                <ProductSimilaire/>
            </section>
        </>
    );
};

export default ProductPage;
