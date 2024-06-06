import { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { UserContext } from '../../context/UserProvider';
import { Data } from '../../services/api';
import { ToastQueue } from "@react-spectrum/toast";

const OrderPage = () => {
    const { orderId } = useParams();
    const { pullData } = useContext(UserContext);
    const [orderDetails, setOrderDetails] = useState(null);
    const [products, setProducts] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const tva = 0.17;

    useEffect(() => {
        const userData = pullData("user");
        if (userData && orderId) {
            const orderData = {
                "user_id": userData.id,
                "order_id": orderId
            };

            Data("orders", "getOrderDetails", orderData).then(response => {
                if (response.success === true) {
                    setOrderDetails(response.data.orderDetails);
                    setProducts(response.data.products);
                    calculateTotalPrice(response.data.products);
                } else {
                    ToastQueue.negative(response.error, { timeout: 5000 });
                }
            });
        }
    }, [orderId]);

    const calculateTotalPrice = (products) => {
        let total = 0;
        products.forEach(product => {
            total += product.price * product.quantity;
        });
        setTotalPrice(parseFloat(total.toFixed(2)));
    };

    // You can reuse handleDelete and handleQuantityChange from BasketPage with some modifications
    // ...

    if (!orderDetails) {
        return <div>Loading...</div>;
    }

    return (
        <div className="order-page">
            <h1 className="order-title">Détails de la commande n°{orderId}</h1>
            {/* Display order details */}
            {/* Display list of products with the ability to update quantity and delete */}
            {/* You can reuse the product list display from BasketPage with some modifications */}
            {/* ... */}
            <div className="total-price">Prix total : {totalPrice.toFixed(2)} €</div>
            <div className="tva-price">TVA : {(totalPrice * tva).toFixed(2)} €</div>
            {/* Add any additional order details you want to display */}
        </div>
    );
};

export default OrderPage;