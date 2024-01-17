// CheckoutPage.js
import React, { useState, useEffect } from 'react';
import '../styles/CheckoutPage.css';
import { Header } from '../../CommonComponents/components/Header';
import { Footer } from '../../CommonComponents/components/Footer';
import axios from 'axios';

import {useNavigate} from 'react-router-dom';

export const CheckoutPage = ({ user }) => {
  const navigate = useNavigate();

  const initPayment = async (data) => {
    try {
      const options = {
        key: "rzp_test_Gj1HHlsQFVyVat",
        amount: data.amount,
        currency: data.currency,
        description: "Test Transaction",
        order_id: data.id,
        handler: async (response) => {
          try {
            const verifyUrl = "http://localhost:5000/api/payment/verify";
            const { data } = await axios.post(verifyUrl, response);
            console.log(data);
          } catch (error) {
            console.log(error);
          }
        },
        theme: {
          color: "#3399cc",
        },
      };
      
      const rzp = new window.Razorpay(options);
      rzp.open();
      
      rzp.on('payment.failed', function (response) {
        console.error(response.error.description);
      });
      
    } catch (error) {
      console.error("Error initiating payment:", error);
    }
  };

  const handlePayment = async () => {
    try {
      console.log("Trying to initiate payment...");
      const orderUrl = "http://localhost:5000/api/payment/orders";
      const { data } = await axios.post(orderUrl, { amount: 18976.89 });
      console.log("Received order data:", data);
      initPayment(data.data);
      navigate('/');
    } catch (error) {
      console.error("Error in handlePayment:", error);
    }
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    handlePayment();
  };

  const [cost, setCost] = useState(0);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [selectedShipping, setSelectedShipping] = useState(false);

  const calculateSubtotal = () => {
    // Calculate subtotal based on cart items (replace with your logic)
    /* return cartItems.reduce((total, item) => total + item.price, 0); */
    return 18789;
  };

  const calculateCost = () => {
    const subtotal = calculateSubtotal();
    const shippingCharges = subtotal * 0.01; // Adjust shipping charges as needed
    const totalCost = subtotal + shippingCharges;
    setCost(totalCost);
  };

  // const showOrderConfirmation = () => {
  //   setOrderConfirmed(true);

  //   // Wait for 5 seconds before resetting order confirmation
  //   setTimeout(() => {
  //     setOrderConfirmed(false);
  //   }, 5000);
  // };

  useEffect(() => {
    calculateCost();
  }, []);

  return (
    <>
      <Header user={ user } />
      <div className="checkout-container fade-in">
        <div className="checkout-summary">
          <h2>Order Summary</h2>
          <div className="summary-totals">
            <ul>
              <li>
                <span>Subtotal</span>
                <span>Rs.{ calculateSubtotal().toFixed(2) }</span>
              </li>
              <li>
                <span>Shipping</span>
                <span>Rs.{ (calculateSubtotal() * 0.01).toFixed(2) }</span>
              </li>
              <li>
                <span>Total</span>
                <span>Rs.{ cost.toFixed(2) }</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="checkout-form fade-in">
          <h2>Shipping Details</h2>
          <form onSubmit={handleFormSubmit}>
            <label>Email address</label>
            <input type="email" autoComplete="off" />

            <label>First Name</label>
            <input type="text" />

            <label>Street Address</label>
            <input type="text" />

            <label>State/Province</label>
            <input type="text" />

            <label>Zip/Postal Code</label>
            <input type="number" />

            <label>Phone Number</label>
            <input type="tel" />

            <h2>Shipping Methods</h2>
            <div className="shipping-methods">
              <label>
                <input
                  type="radio"
                  checked={ selectedShipping }
                  onChange={ () => setSelectedShipping(!selectedShipping) }
                />
                Postal: 2% charges
              </label>
            </div>

            <button className="place-order-button" type='submit'>
            Place Order
            </button>

            {/* { orderConfirmed && (
              <div className="order-confirmation fade-in">
                <p>Your order has been placed successfully! Redirecting...</p>
              </div>
            ) } */}
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};