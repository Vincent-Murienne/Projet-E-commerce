import { Link } from "react-router-dom";
import { Data } from '../../services/api';
import { useEffect, useState } from "react";
import SliderProduct from "./SliderProduct";

const ProductPage = () => {
    const [product, setProduct] = useState(null);

    let data = {
        "table": "products"
    };

    useEffect(() => {
        Data("product", "getProductDetail", data).then(response => {
            if (response.success === true) {
                // Accéder au premier produit du tableau de données
                setProduct(response.data[0]);
            } else {
                ToastQueue.negative(response.error, {timeout: 5000});
            }
        });
    }, []);

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
                            </div>     
                            <Link to="/produits" className="btnProduit">AJOUTER AU PANIER</Link>                     
                        </div>                   
                )}
                
                </div>
                <h1 className="heading">PRODUITS SIMILAIRES :</h1>
            </section>
        </>
    );
};

export default ProductPage;
