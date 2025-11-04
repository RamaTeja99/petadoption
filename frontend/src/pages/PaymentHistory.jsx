import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './PaymentHistory.css';

const PaymentHistory = ({ userId }) => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const API_URL = 'http://localhost:8081';

    useEffect(() => {
        fetchPaymentHistory();
    }, [userId]);

    const fetchPaymentHistory = async () => {
        try {
            const response = await axios.get(
                `${API_URL}/api/payment/history/${userId}`
            );
            
            if (response.data.success) {
                setPayments(response.data.payments);
            }
        } catch (error) {
            console.error('Error fetching payment history:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="loading">Loading payment history...</div>;
    }

    return (
        <div className="payment-history">
            <h2>💰 Payment History</h2>
            
            {payments.length === 0 ? (
                <p className="no-payments">No payments yet</p>
            ) : (
                <table className="payments-table">
                    <thead>
                        <tr>
                            <th>Payment ID</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Payment Method</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments.map((payment) => (
                            <tr key={payment.id}>
                                <td>{payment.razorpayPaymentId || '-'}</td>
                                <td>₹{payment.amount}</td>
                                <td className={`status-${payment.status.toLowerCase()}`}>
                                    {payment.status}
                                </td>
                                <td>{new Date(payment.createdAt).toLocaleDateString()}</td>
                                <td>{payment.paymentMethod}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default PaymentHistory;
