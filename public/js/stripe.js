/* eslint-disable */
import axios from 'axios';
// import { showAlert } from './alert';
import { loadStripe } from '@stripe/stripe-js';
 
export const bookTour = async tourId => {
  const stripe = await loadStripe(
    'pk_test_51NWvdzAAqnHtrKkuU8Kc6B7bnE41KSwrMzPRzIMaIyMJ9OQnpWDWF51PtXxL9qCyvWcA02x1pt8luyBlsN8Ak7GM001O09Zm5Y'
  );
 
  try {
    // 1) Get Checkout session
    const response = await axios.get(
      `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`
    );
    const session = response.data.session;
 
    // 2) Redirect to checkout form
    await stripe.redirectToCheckout({
      sessionId: session.id
    });
  } catch (err) {
    console.log(err);
    // showAlert('error');
  }
};