import CheckoutPayment from "./CheckoutPayment";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const PUBLIC_KEY = "pk_test_51PdxlIRplliLoCbZNYEP6fXAs0KTSMsDbs4Md6orYEXaQDt1zknmrSmgtKL5o4fYedONgu73Kpkw1lLdZ82OSxlH00Eu9QlqRI";
const stripeTestPromise = loadStripe(PUBLIC_KEY);

const StripeContainer = () => {
    return(
        <Elements stripe={stripeTestPromise}>
            <CheckoutPayment />
        </Elements>
    );
};

export default StripeContainer;