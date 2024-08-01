import { useContext, useState, useEffect } from 'react';
import { UserContext } from '../../context/UserProvider';
import { Data } from '../../services/api';
import { ToastQueue } from "@react-spectrum/toast";
import { Link } from 'react-router-dom';

const MyOrdersPage = () => {
    // Setting use states
    const { pullData } = useContext(UserContext);
    const [orders, setOrders] = useState([]);
    const [groupedOrders, setGroupedOrders] = useState({});
    const [userId, setUserId] = useState(null);
    const tva = 0.17;

    useEffect(() => {
        const userData = pullData("user"); // Get user information from the cookies
        if (userData) {
            setUserId(userData.id);
        }
    }, [pullData]);

    // Make an API call to get all the orders of the current user
    useEffect(() => {
        if (userId) {
            const OrdersData = {
                "user_id": userId
            };

            Data("orders", "getAllOrdersByUser", OrdersData).then(response => {
                if (response.success === true) {
                    setOrders(response.data);
                    groupOrdersByYear(response.data);
                } else {
                    ToastQueue.negative(response.error, { timeout: 5000 });
                }
            });
        }
    }, [userId]);

    // Group all the orders by years 
    const groupOrdersByYear = (orders) => {
        const ordersByYear = {};
        orders.forEach(order => {
            const year = new Date(order.order_date).getFullYear();
            if (!ordersByYear[year]) {
                ordersByYear[year] = [];
            }
            ordersByYear[year].push(order);
        });
        setGroupedOrders(ordersByYear);
    };

    return (
        <div className="container-order">
            <h1 className="title-order">Mes Commandes</h1>
            {Object.keys(groupedOrders).sort().reverse().map(year => (
                <div key={year}>
                    <h2 className="yearTitle-order">{year}</h2>
                    <h2 className="order_separator"></h2>
                    <ul className="orderList">
                        {/* Display all the orders of the user by years (decreasing) */}
                        {groupedOrders[year].map(order => (
                            <Link to={`/orderPage/${order.order_id}`} key={order.order_id} className="orderItemHover">
                                <li className="orderItem">
                                    <h3>Commande n°{order.order_id}</h3>
                                    <p>Date de commande: <strong>{order.order_date}</strong></p>
                                    <p>Statut de la commande: <strong>{order.order_status}</strong></p>
                                    <p>Nombre total d'articles: <strong>{order.total_items}</strong></p>
                                    <p>Prix total: <strong>{(Number(order.total_price) + Number(order.total_price) * tva).toFixed(2)}€</strong></p>
                                </li>
                            </Link>
                        ))}
                    </ul>
                </div>
            ))}
            {orders.length === 0 && <p className="errorMessage-order">Aucune commande à afficher.</p>}
        </div>
    );
};

export default MyOrdersPage;