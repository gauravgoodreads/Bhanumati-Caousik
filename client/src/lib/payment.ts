interface PaymentOptions {
  amount: number;
  itemId: string;
  itemTitle: string;
  type: 'package' | 'workshop';
  customerData: {
    name: string;
    email: string;
    phone: string;
    specialRequests?: string;
  };
  onSuccess?: (response: any) => void;
  onError?: (error: any) => void;
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export async function initiatePayment(options: PaymentOptions) {
  try {
    console.log('Initiating payment for:', options.itemTitle);
    
    // Create order on backend
    const orderResponse = await fetch('/api/payment/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: options.amount,
        currency: 'INR',
        receipt: `${options.type}_${Date.now()}`, // Shorter receipt to avoid length issues
        notes: {
          type: options.type,
          itemId: options.itemId,
          itemTitle: options.itemTitle,
        }
      }),
    });

    if (!orderResponse.ok) {
      const errorData = await orderResponse.json();
      throw new Error(errorData.error || 'Failed to create payment order');
    }

    const orderData = await orderResponse.json();
    console.log('Payment order created:', orderData.orderId);

    // Configure Razorpay options
    const razorpayOptions = {
      key: orderData.keyId,
      amount: orderData.amount,
      currency: orderData.currency,
      name: 'Learning Partners Inc',
      description: `${options.itemTitle} - ${options.type === 'package' ? 'Package' : 'Workshop'}`,
      order_id: orderData.orderId,
      prefill: {
        name: options.customerData.name,
        email: options.customerData.email,
        contact: options.customerData.phone,
      },
      theme: {
        color: '#3B82F6', // Blue theme matching the site
      },
      handler: async (response: RazorpayResponse) => {
        try {
          // Verify payment on backend (server uses stored order data, not client data)
          const verifyResponse = await fetch('/api/payment/verify', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              customerData: options.customerData,
            }),
          });

          const verifyData = await verifyResponse.json();

          if (verifyResponse.ok) {
            options.onSuccess?.(verifyData);
          } else {
            throw new Error(verifyData.error || 'Payment verification failed');
          }
        } catch (error) {
          console.error('Payment verification error:', error);
          options.onError?.(error);
        }
      },
      modal: {
        ondismiss: () => {
          console.log('Payment modal dismissed');
          options.onError?.(new Error('Payment cancelled by user'));
        },
      },
    };

    // Load Razorpay script if not already loaded
    if (!window.Razorpay) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.head.appendChild(script);
      
      // Wait for script to load with timeout
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Razorpay script loading timeout'));
        }, 10000); // 10 second timeout
        
        script.onload = () => {
          clearTimeout(timeout);
          resolve(undefined);
        };
        script.onerror = () => {
          clearTimeout(timeout);
          reject(new Error('Failed to load Razorpay script'));
        };
      });
    }

    // Check if Razorpay is available after loading
    if (!window.Razorpay) {
      throw new Error('Razorpay is not available');
    }

    // Open Razorpay checkout
    const rzp = new window.Razorpay(razorpayOptions);
    
    // Add error handling for browser compatibility issues
    try {
      rzp.open();
    } catch (checkoutError) {
      console.error('Razorpay checkout error:', checkoutError);
      // If Razorpay fails to open (e.g., unsupported browser), show a user-friendly message
      options.onError?.(new Error('Payment checkout could not be opened. Please try a different browser or contact support.'));
      return;
    }

  } catch (error) {
    console.error('Payment initiation error:', error);
    options.onError?.(error);
  }
}

export function formatCurrency(amount: number, currency = 'INR'): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(amount);
}