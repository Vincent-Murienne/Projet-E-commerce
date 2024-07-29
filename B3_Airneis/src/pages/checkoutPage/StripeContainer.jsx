import CheckoutPayment from "./CheckoutPayment";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
const stripeTestPromise = loadStripe(PUBLIC_KEY);

const StripeContainer = () => {
    return(
        <Elements stripe={stripeTestPromise}>
            <CheckoutPayment />
        </Elements>
    );
};

export default StripeContainer;