import { useContext, useState, useEffect } from 'react';
import { Data } from '../../services/api';
import { ToastQueue } from "@react-spectrum/toast";
import { UserContext } from '../../context/UserProvider';

const BasketPage = () => {
    const { pullData } = useContext(UserContext);
    const [products, setProducts] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [userId, setUserId] = useState(null);
    const { saveData } = useContext(UserContext);
    const tva = 0.17;
    const totalAPayer = totalPrice + (totalPrice * tva);


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

        Data("basket", "deleteProduct", JSON.stringify(basketsData)).then(response => {
            if (response.success === true) {
                setProducts(currentProducts => {
                    const updatedProducts = currentProducts.filter(product => product.id !== product_id);
                    calculateTotalPrice(updatedProducts);
                    saveData("message", {type: "success", body: "Suppression réussite avec succès !"});
                    return updatedProducts;
                });
            } else {
                ToastQueue.negative(response.error, { timeout: 5000 });
            }
        });
    };

    const handleQuantityChange = (product_id, quantity) => {
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
        setTotalPrice(parseFloat(total.toFixed(2)));
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
                            <p className="product-quantity">Quantité :
                                <input
                                type="number"
                                min="1"
                                value={product.quantity}
                                onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value))}
                                onKeyDown={(e) => {
                                    // Prevent the default action if the key pressed is an arrow key
                                    if (e.key === 'Backspace') {
                                        e.preventDefault();
                                    }
                                }}
                                className="quantity-input"/>
                            </p>
                            <p className="product-price">Prix : {product.price} €</p>
                            <button onClick={() => handleDelete(product.id) + console.log(product.id)}  className="delete-button">Supprimer</button>
                        </div>
                    </div>
                ))}
            </div>
            <div className="checkout-area">
                <div className="total-price">Prix total : {totalPrice.toFixed(2)} €</div>
                <div className="tva-price">TVA : {(totalPrice.toFixed(2) * tva).toFixed(2)} €</div>
                <div className="checkout-button" onClick={() => {/* handle checkout */}}>
                    Passer la commande
                </div>
            </div>
        </div>
    );
}

export default BasketPage;