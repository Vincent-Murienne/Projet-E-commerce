import { useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation, Link  } from "react-router-dom";
import { Data } from "../../services/api";
import { UserContext } from '../../context/UserProvider';
import { ToastQueue } from "@react-spectrum/toast";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";

const CheckoutPayment = () => {
    const { pullData, saveData } = useContext(UserContext);
    const [getSelectedAddressId, setSelectedAddressId] = useState(undefined);
    const [getUserId, setUserId] = useState(undefined);
    const [getTotalPrice, setTotalPrice] = useState(0);

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        let userData = pullData("user");       
        if(userData === undefined){
            ToastQueue.negative("Veuillez vous connecter afin de pouvoir accéder à cette page.", {timeout: 5000});
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

    const calculateTotalPrice = (products) => {
        let total = 0;
        products.map(product => {
            total += product.price * product.quantity;
        });

        setTotalPrice((total + total*0.17).toFixed(2));
    };

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
                    ToastQueue.positive("Commande passée avec succès !", { timeout: 5000 });
                    navigate(`/CheckoutConfirmer/${orderId}`);
                } else {
                    ToastQueue.negative(response.error, { timeout: 5000 });
                }
            });
        } else {
            ToastQueue.negative("Veuillez sélectionner une adresse de livraison et un mode de paiement.", { timeout: 5000 });
        }
    };

    // We need to initialise the use of stripe and its components
    const stripe = useStripe();
    const elements = useElements();

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
            //saveData("message", {type: "error", body: error.message});
            ToastQueue.negative(error.message, { timeout: 5000 });
        }
    };

    return (   
        <>
            <div className="stripe-form">
                <form onSubmit={handleSubmit} style={{maxWidth: 400}}>
                    <CardElement className="stripe-card-element" options={{ hidePostalCode: true }}/>
                    <div className="buttons">
                        <Link to="/panier" className="form-btn-error">Annuler</Link>
                        <button type="submit" className="form-btn-success">Payer</button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default CheckoutPayment;
