import { useParams } from "react-router-dom";
import { Data } from '../../services/api';
import { useContext, useEffect, useState } from "react";
import SliderProduct from "./SliderProduct";
import ProductSimilaire from "./ProductSimilaire";
import { UserContext } from "../../context/UserProvider";
import { ToastQueue } from "@react-spectrum/toast";
import { useTranslation } from 'react-i18next';

const ProductPage = () => {
    const { t } = useTranslation();

    // Setting use states
    const [product, setProduct] = useState(null);
    const [isIncrementDesactivated, setIsIncrementDesactivated] = useState(false);
    const [isDecrementDesactivated, setIsDecrementDesactivated] = useState(true);
    const [cartCount, setCartCount] = useState(1);
    const { productId } = useParams(); 

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await Data("product", "getProductDetail", { table: "products", id: productId });
                if (response.success === true) {
                    setProduct(response.data[0]);
                    setCartCount(1);           
                } else {
                    ToastQueue.negative(t("errorProduct"), {timeout: 5000});
                }
            } catch (error) {
                ToastQueue.negative(t("errorProduct"), {timeout: 5000});
            }
        };

        fetchData();
    }, [productId]);

    // Determine the stock status based on the product's available quantity
    const stockStatus = product && (product.quantity === null || product.quantity <= 0) ? t("outOfStock") : t("inStock");

    const { pullData } = useContext(UserContext);

    // Add product to cart if the user is connected
    const addToCart = async () => {
        let user = pullData("user"); // Get user information from the cookies

        if (!user) {
            ToastQueue.negative(t("loginRequired"), { timeout: 5000 });
            return;
        }
        const data = {
            user_id: user.id,
            product_id: productId,
            quantity: cartCount           
        };
        Data("basket", "insertBasket", data).then(response => {
            if (response.success === true) {
                ToastQueue.positive(t("itemAddedToCart"), { timeout: 5000 });
                setCartCount(1);
                setIsDecrementDesactivated(true);
            } else {
                ToastQueue.negative(response.error, { timeout: 5000 });
            }
        });
    };

    // Decrement the quantity of this product to add to cart (can't go under 1)
    const decrementCartCount = () => {
        if (cartCount > 1) {
            if ((cartCount - 1) === 1){
                setIsDecrementDesactivated(true);
            }
            setIsIncrementDesactivated(false)
            setCartCount(cartCount - 1);           
        }       
    };

    // Increment the quantity of this product to add to cart (can't go over the stock in the database)
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
                                    <h3>{stockStatus}</h3>
                                </div>
                                <h2>{product.price} €</h2>
                                <h3>{product.description}.</h3>
                                {product.material && (
                                    <h3>{t('material')} {product.material}.</h3>
                                )}
                            </div>
                            <p className="quantity-container">
                                <button onClick={decrementCartCount} className={`quantity-button ${isDecrementDesactivated ? 'disabled' : ''}`}>-</button>
                                <span className="quantity">{t('quantity')} {cartCount}</span>
                                <button onClick={incrementCartCount} className={`quantity-button ${isIncrementDesactivated ? 'disabled' : ''}`}>+</button>
                            </p> 
                            <button onClick={addToCart} className={`btnProduit ${stockStatus === t('inStock') ? "" : "disabled"}`} disabled={stockStatus !== t('inStock')}>
                                {stockStatus === t('inStock') ? t('addToCart') : t('outOfStock')}
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
