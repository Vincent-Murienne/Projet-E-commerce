import { useContext, useState, useEffect } from 'react';
import { Data } from '../../services/api';
import { ToastQueue } from "@react-spectrum/toast";
import { UserContext } from '../../context/UserProvider';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const BasketPage = () => {
    const { t } = useTranslation();
    const { pullData } = useContext(UserContext);
    const [products, setProducts] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [userId, setUserId] = useState(null);
    const { saveData } = useContext(UserContext);
    const tva = 0.17;
    const totalAPayer = totalPrice + (totalPrice * tva);

    const navigate = useNavigate();

    useEffect(() => {
        const userData = pullData("user");
        if (userData) {
            setUserId(userData.id);
            const basketsData = {
                "user_id": userData.id
            };

            Data("basket", "getProduct", basketsData).then(response => {
                if (response.success === true) {
                    setProducts(response.data);
                    calculateTotalPrice(response.data);
                } else {
                    ToastQueue.negative(response.error, { timeout: 5000 });
                }
            });
        }
    }, []);

    const handleDelete = (product_id) => {
        const basketsData = {
            "user_id": userId,
            "product_id": product_id
        };

        Data("basket", "deleteProduct", basketsData).then(response => {
            if (response.success === true) {
                setProducts(currentProducts => {
                    const updatedProducts = currentProducts.filter(product => product.id !== product_id);
                    calculateTotalPrice(updatedProducts);
                    saveData("message", {type: "success", body: t('deleteSuccess')});
                    return updatedProducts;
                });
            } else {
                ToastQueue.negative(response.error, { timeout: 5000 });
            }
        });
    };

    const handleQuantityChange = (product_id, quantity) => {
        if(quantity === 0) {
            handleDelete(product_id);
        } else {
            const basketsData = {
                "user_id": userId,
                "product_id": product_id,
                "quantity": quantity
            };

            Data("basket", "updateProductQuantity", basketsData).then(response => {
                if (response.success === true) {
                    setProducts(currentProducts => {
                        const updatedProducts = currentProducts.map(product => {
                            if (product.id === product_id) {
                                return { ...product, quantity };
                            }
                            return product;
                        });
                        calculateTotalPrice(updatedProducts);
                        return updatedProducts;
                    });
                }
            });
        }
    };

    const calculateTotalPrice = (products) => {
        let total = 0;
        const updatedProducts = products.map(product => {
            if (product.stock === 0) {
                product.quantity = 0;
            } else {
                total += product.price * product.quantity;
            }
            return product;
        });
        setProducts(updatedProducts);
        setTotalPrice(parseFloat(total.toFixed(2)));
    };

    const hasInStockProduct = (products) => {
        return products.some(product => product.stock > 0);
    };

    const handleCheckout = () => {
        navigate('/checkoutAdresse');
    };
    return (
        <div className="basket-page">
            <div className="basket-title">{t('yourBasket')}</div>
            <div className="product-list">
                {products.map((product, index) => (
                    <div key={product.id || index} className={`product-card ${product.stock === 0 ? 'disabled' : ''}`}>
                        <img src={`/img/${product.image_name}`} alt={product.name} className="product-image" />
                        <div className={`product-info ${product.stock === 0 ? 'disabled' : ''}`}>
                            <h2 className="product-name">{product.name}</h2>
                            <p className="product-description">{product.description}</p>
                            <p className="product-quantity">{t('quantity')} :
                                <input
                                    type="number"
                                    min="1"
                                    max={product.stock}
                                    value={product.quantity}
                                    onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value))}
                                    onKeyDown={(e) => {
                                        // Allow navigation keys: backspace, tab, end, home, left arrow, right arrow
                                        const allowedKeys = ['Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
                                        if (!allowedKeys.includes(e.key)) {
                                            e.preventDefault();
                                        }
                                    }}
                                    className="quantity-input"
                                    disabled={product.stock === 0}
                                />
                            </p>
                            <p className="product-price">{t('price')} : {product.price} €</p>
                            {product.stock == 0 || product.quantity == 0 ? <p className="out-of-stock">{t('notEnoughStock')}</p> : ""}
                            <button onClick={() => handleDelete(product.id)}  className="delete-button">{t('delete')}</button>
                        </div>
                    </div>
                ))}
            </div>
            <div className="checkout-area">
                <div className="total-price">{t('totalPrice')} : {totalPrice.toFixed(2)} €</div>
                <div className="tva-price">{t('VAT')} : {(totalPrice.toFixed(2) * tva).toFixed(2)} €</div>
                <div
                    className={`checkout-button ${!userId || products.length === 0 || !hasInStockProduct(products) ? 'disabled' : ''}`}
                    onClick={() => {
                        if (userId && products.length > 0 && hasInStockProduct(products)) {
                            handleCheckout();
                        }
                    }}
                    disabled={!userId || products.length === 0 || !hasInStockProduct(products)}
                >
                    {t('placeOrder')} 
                </div>
            </div>
        </div>
    );
}

export default BasketPage;