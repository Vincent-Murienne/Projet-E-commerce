import { useState, useEffect } from 'react';
import { Data } from '../../services/api';
import { ToastQueue } from "@react-spectrum/toast";

const BasketPage = () => {
    const [products, setProducts] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const data = {
        "userId": 3
    };

    useEffect(() => {
        Data("basket", "getProduct", data).then(response => {
            if (response.success === true) {
                setProducts(response.data);
                calculateTotalPrice(response.data);
            } else {
                ToastQueue.negative(response.error, { timeout: 5000 });
            }
        });
    }, []);

    const handleDelete = (productId) => {
        Data("basket", "deleteProduct", { userId: data, productId }).then(response => {
            if (response.success === true) {
                // Mettre à jour l'état des produits après la suppression
                setProducts(products.filter(product => product.id !== productId));
                calculateTotalPrice(products.filter(product => product.id !== productId));
            } else {
                ToastQueue.negative(response.error, { timeout: 5000 });
            }
        });
    };

    const handleQuantityChange = (productId, quantity) => {
        Data("basket", "updateProductQuantity", { userId: data, productId, quantity }).then(response => {
            if (response.success === true) {
                // Mettre à jour l'état des produits avec la nouvelle quantité
                setProducts(products.map(product => {
                    if (product.id === productId) {
                        return { ...product, quantity };
                    }
                    return product;
                }));
                calculateTotalPrice(products);
            } else {
                ToastQueue.negative(response.error, { timeout: 5000 });
            }
        });
    };

    const calculateTotalPrice = (products) => {
        let total = 0;
        products.forEach(product => {
            total += product.price * product.quantity;
        });
        setTotalPrice(total);
    };

    return (
        <div className="basket-page">
            <div className="basket-title">Votre panier</div>
            <div className="product-list">
                {products.map((product, index) => (
                    <div key={product.id || index} className="product-card">
                        <img src={`/img/${product.image_name}`} alt={product.name} className="product-image" />
                        <div className="product-info">
                            <h2 className="product-name">{product.name}</h2>
                            <p className="product-description">{product.description}</p>
                            <p className="product-quantity">Quantité: {product.quantity}</p>
                            <p className="product-price">{product.price} €</p>
                        </div>
                        <button onClick={() => handleDelete(product.id)} className="delete-button">🗑️</button>
                        <input
                            type="number"
                            value={product.quantity}
                            onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value))}
                            className="quantity-input"
                        />
                    </div>
                ))}
            </div>
            <div className="checkout-area">
                <div className="total-price">TOTAL: {totalPrice} €</div>
                <div className="checkout-button" onClick={() => {/* handle checkout */}}>
                    Passer la commande
                </div>
            </div>
        </div>
    );
}

export default BasketPage;