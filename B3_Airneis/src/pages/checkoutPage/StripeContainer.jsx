import CheckoutPayment from "./CheckoutPayment";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY; // Import stripe public key from the .env file
const stripeTestPromise = loadStripe(PUBLIC_KEY); // Load stripe with the public key

const StripeContainer = () => {
    return(
        // We surround the CheckoutPayment, so it can inherit of the context and the stripe promise
        <Elements stripe={stripeTestPromise}> 
            <CheckoutPayment />
        </Elements>
    );
};

export default StripeContainer;