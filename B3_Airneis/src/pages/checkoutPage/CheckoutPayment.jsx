import { useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation, Link  } from "react-router-dom";
import { Data } from "../../services/api";
import { UserContext } from '../../context/UserProvider';
import { ToastQueue } from "@react-spectrum/toast";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useTranslation } from 'react-i18next';


const CheckoutPayment = () => {
    const { t } = useTranslation();

    // Setting use states
    const { pullData, saveData } = useContext(UserContext);
    const [getSelectedAddressId, setSelectedAddressId] = useState(undefined);
    const [getUserId, setUserId] = useState(undefined);
    const [getTotalPrice, setTotalPrice] = useState(0);

    const navigate = useNavigate();
    const location = useLocation();

    // Make an API call to get all the order details. If the user is not connected, sends him back to the homepage with an error
    useEffect(() => {
        let userData = pullData("user"); // Get user information from the cookies    
        if(userData === undefined){
            ToastQueue.negative(t("pleaseLogin"), {timeout: 5000});
            navigate("/");
            return;
        }
        setUserId(userData.id);

        const addressId = new URLSearchParams(location.search).get("addressId");
        setSelectedAddressId(addressId);

        Data("basket", "getProduct", {"user_id": userData.id}).then(response => {
            if (response.success === true) {
                calculateTotalPrice(response.data);
            } else {
                ToastQueue.negative(response.error, { timeout: 5000 });
            }
        });
    });

    // Calculate the total price including TVA
    const calculateTotalPrice = (products) => {
        let total = 0;
        products.map(product => {
            total += product.price * product.quantity;
        });

        setTotalPrice((total + total*0.17).toFixed(2));
    };

    // Add the order in the database
    const insertOrder = async () => {
        if (getUserId && getSelectedAddressId) {
            let orderData = {
                "table": "orders",
                "data": {
                    "user_id": getUserId,
                    "address_id": getSelectedAddressId,
                    "order_state": "EN COURS"
                }
            };

            Data("orders", "insertOrder", orderData).then(response => {
                if (response.success === true) {
                    const orderId = response.order_id;
                    ToastQueue.positive(t("OrderSucces"), { timeout: 5000 });
                    navigate(`/CheckoutConfirmer/${orderId}`);
                } else {
                    ToastQueue.negative(response.error, { timeout: 5000 });
                }
            });
        } else {
            ToastQueue.negative(t("choice"), { timeout: 5000 });
        }
    };

    // We need to initialise the use of stripe and its components
    const stripe = useStripe();
    const elements = useElements();

    // Form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // We need to create a token that we will then send to our backend
        const { token, error } = await stripe.createToken(elements.getElement(CardElement));

        if(!error) {
            Data("stripe", "charge", {amount: getTotalPrice, id: token.id}).then(response => {
                // If the payment succeed, we add the order to the database
                if(response.success) {
                    insertOrder();
                } else {
                    ToastQueue.negative(response.error, { timeout: 5000 });
                }
            });
        } else {
            ToastQueue.negative(error.message, { timeout: 5000 });
        }
    };

    return (   
        <>
            <div className="stripe-form">
                <form onSubmit={handleSubmit} style={{maxWidth: 400}}>
                    <CardElement className="stripe-card-element" options={{ hidePostalCode: true }}/>
                    <div className="buttons">
                        <Link to="/panier" className="form-btn-error">{t('backButton')}</Link>
                        <button type="submit" className="form-btn-success">{t('payButton')}</button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default CheckoutPayment;
