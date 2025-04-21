import React, { useEffect, useState } from "react";
import { loadStripe } from '@stripe/stripe-js';
import { useLocation } from "react-router-dom";
import { environment } from "../environments/environment";
import storageService from "../services/storageService";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(environment.stripePublishableKey);

const PaymentForm = ({ clientSecret }: { clientSecret: string }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const submitPayment = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      console.error('Stripe not initialized');
      setLoading(false);
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
    <form onSubmit={submitPayment}>
      <PaymentElement />
      <button type="submit" disabled={loading} className="btn btn-primary mt-3">
        {loading ? "Processing..." : "Pay now"}
      </button>
      {message && <div className="alert alert-info mt-3">{message}</div>}
    </form>
  );
}

const PaymentPage = () => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const totalPrice = Number(params.get('totalPrice'));
    console.log('paymentComponent() Total Price:', totalPrice);

    if (totalPrice) {
      fetchPaymentIntent(totalPrice);
    }
  }, [location.search]);
  
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

    const data = await response.json();
    setClientSecret(data.clientSecret);
  };

  return (
    <div>
      <h2>Payment</h2>
      {clientSecret ? (
        <Elements 
          stripe={stripePromise} 
          options={{
            clientSecret,
            appearance: { theme: 'stripe' }
          }}
        >
          <PaymentForm clientSecret={clientSecret}/>
        </Elements>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default PaymentPage;
