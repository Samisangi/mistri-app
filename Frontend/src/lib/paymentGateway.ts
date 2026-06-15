/**
 * Payment Gateway Integration
 * 
 * This file provides a payment processing interface that can be integrated
 * with popular payment gateways like Stripe or Razorpay.
 * 
 * Current Implementation: Simulated for development
 * Production: Replace with actual payment gateway SDK
 */

export interface PaymentDetails {
  amount: number;
  currency: string;
  orderId: string;
  customerId: string;
  customerEmail: string;
  customerName: string;
  description: string;
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  paymentMethod?: string;
  status: 'succeeded' | 'failed' | 'pending';
  errorMessage?: string;
}

/**
 * Initialize payment gateway
 * For Stripe: Use Stripe.js library
 * For Razorpay: Use Razorpay checkout
 */
export const initializePaymentGateway = () => {
  // TODO: Initialize actual payment gateway
  // Example for Stripe:
  // import { loadStripe } from '@stripe/stripe-js';
  // const stripe = await loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);
  
  console.log("Payment gateway initialized (simulation mode)");
  return true;
};

/**
 * Process payment through gateway
 * This is a simulation - replace with actual gateway integration
 */
export const processPayment = async (paymentDetails: PaymentDetails): Promise<PaymentResult> => {
  console.log("Processing payment:", paymentDetails);

  // SIMULATION: Add 2-second delay to mimic API call
  await new Promise(resolve => setTimeout(resolve, 2000));

  // SIMULATION: 95% success rate for testing
  const isSuccess = Math.random() > 0.05;

  if (isSuccess) {
    // SUCCESS SIMULATION
    const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Store transaction in localStorage for record keeping
    const transactions = JSON.parse(localStorage.getItem("transactions") || "[]");
    transactions.push({
      transactionId,
      orderId: paymentDetails.orderId,
      amount: paymentDetails.amount,
      currency: paymentDetails.currency,
      customerId: paymentDetails.customerId,
      status: 'succeeded',
      timestamp: Date.now(),
      gateway: 'simulation'
    });
    localStorage.setItem("transactions", JSON.stringify(transactions));

    return {
      success: true,
      transactionId,
      paymentMethod: 'card',
      status: 'succeeded'
    };
  } else {
    // FAILURE SIMULATION
    return {
      success: false,
      status: 'failed',
      errorMessage: 'Payment declined by bank. Please try another card.'
    };
  }
};

/**
 * Refund a payment
 * For actual implementation, use gateway's refund API
 */
export const refundPayment = async (transactionId: string, amount: number): Promise<PaymentResult> => {
  console.log("Processing refund:", { transactionId, amount });

  // SIMULATION: Add delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // SIMULATION: Always succeed for refunds
  const refundId = `REFUND_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Update transaction record
  const transactions = JSON.parse(localStorage.getItem("transactions") || "[]");
  const txIndex = transactions.findIndex((tx: any) => tx.transactionId === transactionId);
  
  if (txIndex !== -1) {
    transactions[txIndex].status = 'refunded';
    transactions[txIndex].refundId = refundId;
    transactions[txIndex].refundedAt = Date.now();
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }

  return {
    success: true,
    transactionId: refundId,
    status: 'succeeded'
  };
};

/**
 * Release payment from escrow to seller
 * In production, this would trigger the transfer to seller's account
 */
export const releaseEscrowPayment = async (orderId: string, mistriId: string, amount: number): Promise<boolean> => {
  console.log("Releasing escrow payment:", { orderId, mistriId, amount });

  // SIMULATION: Add delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Calculate platform commission (15%)
  const commission = amount * 0.15;
  const mistriAmount = amount - commission;

  // Record the payout
  const payouts = JSON.parse(localStorage.getItem("payouts") || "[]");
  payouts.push({
    payoutId: `PAYOUT_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    orderId,
    mistriId,
    grossAmount: amount,
    commission,
    netAmount: mistriAmount,
    status: 'completed',
    timestamp: Date.now()
  });
  localStorage.setItem("payouts", JSON.stringify(payouts));

  console.log(`Payout: ₹${mistriAmount} to Mistri (₹${commission} platform fee)`);

  return true;
};

/**
 * Get transaction history
 */
export const getTransactionHistory = (userId: string): any[] => {
  const transactions = JSON.parse(localStorage.getItem("transactions") || "[]");
  return transactions.filter((tx: any) => tx.customerId === userId);
};

/**
 * Get payout history for Mistri
 */
export const getPayoutHistory = (mistriId: string): any[] => {
  const payouts = JSON.parse(localStorage.getItem("payouts") || "[]");
  return payouts.filter((payout: any) => payout.mistriId === mistriId);
};

/**
 * Integration Instructions:
 * 
 * FOR STRIPE:
 * 1. npm install @stripe/stripe-js @stripe/react-stripe-js
 * 2. Set environment variable: REACT_APP_STRIPE_PUBLISHABLE_KEY
 * 3. Replace processPayment with Stripe checkout session
 * 4. Create backend endpoint to handle Stripe webhooks
 * 
 * FOR RAZORPAY:
 * 1. npm install razorpay
 * 2. Set environment variables: REACT_APP_RAZORPAY_KEY_ID
 * 3. Replace processPayment with Razorpay checkout
 * 4. Create backend endpoint to verify payment signature
 * 
 * IMPORTANT: Never store API secrets in frontend code!
 * Always use backend API for payment processing and verification.
 */

export default {
  initializePaymentGateway,
  processPayment,
  refundPayment,
  releaseEscrowPayment,
  getTransactionHistory,
  getPayoutHistory
};
