import React, { useEffect, useState } from "react";
import { Appearance, loadStripe, Stripe, StripeElementsOptions } from '@stripe/stripe-js';
import { useLocation } from "react-router-dom";
import { environment } from "../environments/environment";
import storageService from "../services/storageService";

// type PaymentPageProps = {
//   id: number
// };

const PaymentPage = () => {
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [elements, setElements] = useState(null);
  const [paymentElement, setPaymentElement] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [totalPrice, setTotalPrice] = useState(0);

  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const price = Number(params.get('totalPrice'));
    setTotalPrice(price);
    console.log('paymentComponent() Total Price:', price);

    loadStripeAndInitialize(price);
  }, [location.search]);

  const loadStripeAndInitialize = async (price: number) => {
    try {
      const stripeInstance = await loadStripeScript(environment.stripePublishableKey);
      if (!stripeInstance) {
        console.error('Failed to load Stripe.js');
        return;
      }
      setStripe(stripeInstance);

      const { clientSecret } = await fetchPaymentIntent(price);
      if (!clientSecret) {
        throw new Error('Missing clientSecret from payment intent');
      }
      const appearance: Appearance = { theme: 'stripe' };
      const options: StripeElementsOptions = { clientSecret, appearance };
      const stripeElements = (stripeInstance as any).elements(options);
      setElements(stripeElements);

      const payment = stripeElements.create('payment');
      payment.mount('#payment-element');
      setPaymentElement(payment);
      console.log('Payment Element successfully mounted');
    } catch (error) {
      console.error('Error initializing Stripe:', error);
    }
  };

  const loadStripeScript = async (publishableKey: string): Promise<Stripe | null> => {
    if (window.Stripe) {
      return loadStripe(publishableKey);
    }
  
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://js.stripe.com/v3/';
      script.async = true;
  
      script.onload = async () => {
        const stripeInstance = await loadStripe(publishableKey);
        resolve(stripeInstance);
      };
  
      script.onerror = () => {
        console.error('Failed to load Stripe.js');
        resolve(null);
      };
  
      document.body.appendChild(script);
    });
  };
  

  const fetchPaymentIntent = async (amount: number) => {
    const token = storageService.getJwtToken();

    const response = await fetch(`${environment.gatewayUrl}/api/core/payments/create-payment-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ amount, currency: 'usd' })
    });

    return await response.json();
  };

  const submitPayment = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    console.log('Entry point submitPayment()');
    setLoading(true);

    if (!stripe || !elements) {
      console.error('Stripe not initialized');
      return;
    }

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success`,
        },
      });

      if (error) {
        console.error('Payment failed:', error.message);
        setMessage(error.message ?? 'Unknown error');
      } else {
        setMessage('Payment succeeded!');
      }
    } catch (err) {
      console.error('Error during payment submission:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Payment</h2>
      <form onSubmit={submitPayment}>
        <div id="payment-element" />
        <button type="submit" disabled={loading} className="btn btn-primary mt-3">
          {loading ? 'Processing...' : 'Pay'}
        </button>
      </form>
      {message && <div className="alert alert-info mt-3">{message}</div>}
    </div>
  );
};

export default PaymentPage;
