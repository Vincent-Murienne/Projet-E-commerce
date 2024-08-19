import { useContext, useState, useEffect } from 'react';
import { UserContext } from '../../context/UserProvider';
import { Data } from '../../services/api';
import { ToastQueue } from "@react-spectrum/toast";
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const MyOrdersPage = () => {
  const { t } = useTranslation();
  const { pullData } = useContext(UserContext);
  const [orders, setOrders] = useState([]);
  const [groupedOrders, setGroupedOrders] = useState({});
  const [userId, setUserId] = useState(null);
  const tva = 0.17;

  useEffect(() => {
    const userData = pullData("user"); // Récupération des informations utilisateur à partir des cookies
    if (userData) {
      setUserId(userData.id);
    }
  }, [pullData]);

  // Appel API pour obtenir toutes les commandes de l'utilisateur actuel
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
          ToastQueue.negative(t(response.error), { timeout: 5000 });
        }
      });
    }
  }, [userId, t]);

  // Grouper toutes les commandes par années
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
      <h1 className="title-order">{t('DetailOrder')}</h1>
      {Object.keys(groupedOrders).sort().reverse().map(year => (
        <div key={year}>
          <h2 className="yearTitle-order">{year}</h2>
          <h2 className="order_separator"></h2>
          <ul className="orderList">
            {/* Afficher toutes les commandes de l'utilisateur par années (décroissant) */}
            {groupedOrders[year].map(order => (
              <Link to={`/orderPage/${order.order_id}`} key={order.order_id} className="orderItemHover">
                <li className="orderItem">
                  <h3>{t('orderNumber', { orderId: order.order_id })}</h3>
                  <p>{t('orderDate')}: <strong>{order.order_date}</strong></p>
                  <p>{t('orderStatus')}: <strong>{order.order_status}</strong></p>
                  <p>{t('totalItems')}: <strong>{order.total_items}</strong></p>
                  <p>{t('totalPrice')}: <strong>{(Number(order.total_price) + Number(order.total_price) * tva).toFixed(2)}€</strong></p>
                </li>
              </Link>
            ))}
          </ul>
        </div>
      ))}
      {orders.length === 0 && <p className="errorMessage-order">{t('noOrders')}</p>}
    </div>
  );
};

export default MyOrdersPage;
