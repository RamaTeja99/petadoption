import React, { useState } from 'react';
import axios from 'axios';
import './RazorpayPayment.css';

const RazorpayPayment = ({ amount, userId, adoptionId, onSuccess, onFailure }) => {
    const [loading, setLoading] = useState(false);
    const API_URL = 'http://localhost:8081';
    const RAZORPAY_KEY_ID = 'rzp_test_YOUR_TEST_KEY_ID'; // Replace with your key

    const handlePayment = async () => {
        setLoading(true);
        
        try {
            // Step 1: Create order on backend
            console.log('Creating order...');
            const orderResponse = await axios.post(
                `${API_URL}/api/payment/create-order`,
                {
                    userId: userId,
                    adoptionId: adoptionId,
                    amount: amount
                }
            );
            
            if (!orderResponse.data.success) {
                throw new Error(orderResponse.data.message || 'Failed to create order');
            }
            
            const { orderId, amount: orderAmount, currency } = orderResponse.data;
            
            console.log('Order created:', orderId);
            
            // Step 2: Load Razorpay checkout
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.async = true;
            
            script.onload = () => {
                // Step 3: Initialize Razorpay options
                const options = {
                    key: RAZORPAY_KEY_ID,
                    amount: orderAmount,
                    currency: currency,
                    name: 'Pet Adoption Platform',
                    description: 'Adoption Fee Payment',
                    order_id: orderId,
                    handler: async function (response) {
                        try {
                            console.log('Payment response received:', response);
                            
                            // Step 4: Verify payment on backend
                            const verifyResponse = await axios.post(
                                `${API_URL}/api/payment/verify-payment`,
                                {
                                    razorpay_order_id: response.razorpay_order_id,
                                    razorpay_payment_id: response.razorpay_payment_id,
                                    razorpay_signature: response.razorpay_signature
                                }
                            );
                            
                            console.log('Verification response:', verifyResponse.data);
                            
                            if (verifyResponse.data.success) {
                                console.log('Payment verified successfully');
                                onSuccess({
                                    paymentId: verifyResponse.data.paymentId,
                                    razorpayPaymentId: response.razorpay_payment_id,
                                    orderId: orderId
                                });
                            } else {
                                console.error('Verification failed:', verifyResponse.data.message);
                                onFailure(verifyResponse.data.message || 'Payment verification failed');
                            }
                        } catch (error) {
                            console.error('Verification error:', error);
                            onFailure(error.message || 'Payment verification failed');
                        }
                    },
                    prefill: {
                        name: 'User Name', // Should be fetched from user data
                        email: 'user@example.com', // Should be fetched from user data
                        contact: '9999999999' // Should be fetched from user data
                    },
                    theme: {
                        color: '#3399cc'
                    },
                    modal: {
                        ondismiss: function () {
                            console.log('Payment modal dismissed');
                            setLoading(false);
                        }
                    }
                };
                
                // Step 5: Open Razorpay checkout
                const razorpayInstance = new window.Razorpay(options);
                razorpayInstance.open();
            };
            
            script.onerror = () => {
                throw new Error('Failed to load Razorpay script');
            };
            
            document.body.appendChild(script);
            
        } catch (error) {
            console.error('Payment error:', error);
            onFailure(error.message || 'Payment failed');
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className="razorpay-payment">
            <button 
                onClick={handlePayment} 
                disabled={loading}
                className="payment-button"
            >
                {loading ? '⏳ Processing...' : `💳 Pay ₹${amount}`}
            </button>
        </div>
    );
};

export default RazorpayPayment;
