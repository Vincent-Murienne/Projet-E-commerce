import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Data } from '../../services/api';
import { ToastQueue } from "@react-spectrum/toast";

const OrderPage = () => {
    const { orderId } = useParams();
    const [orderDetails, setOrderDetails] = useState([]);
    const [orderDate, setOrderDate] = useState("");
    const [orderState, setOrderState] = useState("");
    const [orderAddress, setOrderAddress] = useState("");
    const [totalPrice, setTotalPrice] = useState(0);
    const tva = 0.17;

    useEffect(() => {
        if (orderId) {
            const orderData = {
                "order_id": orderId
            };

            Data("orders", "getOrderDetails", orderData).then(response => {
                console.log(response);
                if (response.success === true) {
                    setOrderDetails(response.data);
                    setOrderDate(response.data[0].date);
                    setOrderState(response.data[0].order_state);
                    setOrderAddress(response.data[0].address_name);
                } else {
                    ToastQueue.negative(response.error, { timeout: 5000 });
                }
            });
        }
    }, []);

    useEffect(() => {
        calculateTotalPrice();
    }, [orderDetails]);

    const calculateTotalPrice = () => {
        let total = 0;
        orderDetails.forEach(product => {
            total += product.product_price * product.quantity;
        });
        total = total + total * tva;
        setTotalPrice(parseFloat(total.toFixed(2)));
    };

    return (
        <div className="container-order">
            <h1 className="title-order">Mes Commandes</h1>
            <h2 className="orderDetails">Date de la commande: {orderDate}</h2>
            <h2 className="orderDetails">Statut de la commande: {orderState}</h2>
            <h2 className="orderDetails">Prix total de la commande: {totalPrice} €</h2>
            <h2 className="orderDetails">Adresse de livraison: {orderAddress}</h2>
            <h2 className="order_separator"></h2>
            {orderDetails.map(product => (
                <div key={product.product_id} className="orderDetailsItem">
                    <div>
                        <img src={`/img/${product.image_name}`} alt="" className="imageOrder"/>
                    </div>
                    <div className="orderDetailsInfos">
                        <h3>{product.product_name}</h3>
                        <p><strong>Description:</strong> {product.product_description}</p>
                        <p><strong>Quantité:</strong> {product.quantity}</p>
                        <p><strong>Prix total:</strong> {(Number(product.quantity) * Number(product.product_price)).toFixed(2)} €</p>
                    </div>
                </div>
            ))}
            {orderDetails.length === 0 && <p className="errorMessage-order">Cette commande est vide.</p>}
        </div>
    );
};

export default OrderPage;