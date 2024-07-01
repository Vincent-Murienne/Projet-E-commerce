import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51PNVhmP9bcXFAffeDMofjBlttvmxQejtsYEgmhpfgmY8isoUDkzv4BoESPHnQc6QRIRAdOmIumkABfrPTABcGtmn00GsTkDbJm');

const CheckoutButton = () => {
  const handleClick = async () => {
    const stripe = await stripePromise;

    const response = await fetch('http://localhost:4242/create-checkout-session.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const session = await response.json();

    const result = await stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (result.error) {
      console.error(result.error.message);
    }
  };

  return (
    <button role="link" onClick={handleClick}>
      Checkout
    </button>
  );
};

export default CheckoutButton;
