import { Link, useParams } from "react-router-dom";
import { Data } from '../../services/api';
import { useContext, useEffect, useState } from "react";
import SliderProduct from "./SliderProduct";
import ProductSimilaire from "./ProductSimilaire";
import { UserContext } from "../../context/UserProvider";
import { ToastQueue } from "@react-spectrum/toast";

const ProductPage = () => {
    const [product, setProduct] = useState(null);
    const [isIncrementDesactivated, setIsIncrementDesactivated] = useState(false);
    const [isDecrementDesactivated, setIsDecrementDesactivated] = useState(true);

    const [cartCount, setCartCount] = useState(1);
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

    const { pullData } = useContext(UserContext);

    const addToCart = async () => {
        let user = pullData("user");
        console.log(user);

        if (!user) {
            ToastQueue.negative("Veuillez vous connecter pour ajouter des produits au panier.", { timeout: 5000 });
            return;
        }

        const data = {
            table: "baskets",
            data: {
                user_id: user.id,
                product_id: productId,
                quantity: cartCount
            }
        };

        Data("panelAdmin", "insert", data).then(response => {
            if (response.success === true) {
                ToastQueue.positive("L'élément a bien été ajouté au panier.", { timeout: 5000 });
                setCartCount(1);
            } else {
                ToastQueue.negative(response.error, { timeout: 5000 });
            }
        });
    };

    const decrementCartCount = () => {
        
        if (cartCount > 1) {
            if ((cartCount - 1) === 1){
                setIsDecrementDesactivated(true);
            }
            setIsIncrementDesactivated(false)
            setCartCount(cartCount - 1);           
        }       
    };

    const incrementCartCount = () => {
        if(product && product.quantity > 0 && cartCount < product.quantity) {
            if((cartCount + 1) === product.quantity){
                setIsIncrementDesactivated(true);      
            }
            setIsDecrementDesactivated(false);
            setCartCount(cartCount + 1);
        }
    };

    return (
        <>
            <section className="categoriePage">
                <div className="slider-and-text">
                    <SliderProduct productId={productId} />
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
                            <p className="quantity-container">
                                <button onClick={decrementCartCount} className={`quantity-button ${isDecrementDesactivated ? 'disabled' : ''}`}>-</button>
                                <span className="quantity">Quantité : {cartCount}</span>
                                <button onClick={incrementCartCount} className={`quantity-button ${isIncrementDesactivated ? 'disabled' : ''}`}>+</button>
                            </p> 
                            <button onClick={addToCart} className={`btnProduit ${stockStatus === "En stock" ? "" : "disabled"}`} disabled={stockStatus !== "En stock"}>
                                {stockStatus === "En stock" ? "AJOUTER AU PANIER" : "STOCK ÉPUISÉ"}
                            </button>
                        </div>
                    )}
                </div>
                {product && <ProductSimilaire categoryId={product.category_id} productId={product.id} />}
            </section>
        </>
    );
};

export default ProductPage;
