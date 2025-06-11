import { Alert } from 'react-native';
import { useStripe } from '@stripe/stripe-react-native';
import { EnrichedSession } from '@/types/EnrichedSession';

export class PaymentService {
    private static instance: PaymentService;
    private stripe = useStripe();
    private apiBaseUrl = process.env.EXPO_PUBLIC_BACKEND_BASE_URL;

    private constructor() {}

    static getInstance(): PaymentService {
        if (!PaymentService.instance) {
            PaymentService.instance = new PaymentService();
        }
        return PaymentService.instance;
    }

    async initiatePayment(session: EnrichedSession): Promise<boolean> {
        try {
            // 1. Create payment intent
            const response = await fetch(`${this.apiBaseUrl}/payments/create-intent`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: session.billingDetails!.total * 100, // Convert to cents
                    currency: 'cad',
                    sessionId: session.id,
                    pswStripeAccountId: session.otherUser?.stripeAccountId || 'acct_1RXSGaQ7lSoEt20C'
                })
            });

            if (!response.ok) {
                throw new Error('Failed to create payment intent');
            }

            const { clientSecret } = await response.json();
            
            if (!clientSecret) {
                throw new Error('No client secret received');
            }

            // 2. Initialize payment sheet
            const { error: initError } = await this.stripe.initPaymentSheet({
                paymentIntentClientSecret: clientSecret,
                merchantDisplayName: 'Amicare',
                returnURL: 'amicare://stripe-redirect',
                applePay: {
                    merchantCountryCode: 'CA'
                },
                googlePay: {
                    merchantCountryCode: 'CA',
                    testEnv: true
                },
                appearance: {
                    colors: {
                        primary: '#008DF4'
                    }
                },
                defaultBillingDetails: {
                    address: {
                        country: 'CA'
                    }
                }
            });

            if (initError) {
                console.error('Payment sheet init error:', initError);
                this.handlePaymentError(initError);
                return false;
            }

            // 3. Present payment sheet
            const { error: presentError } = await this.stripe.presentPaymentSheet();

            if (presentError) {
                console.error('Payment error:', presentError);
                this.handlePaymentError(presentError);
                return false;
            }

            return true;

        } catch (error) {
            console.error('Payment service error:', error);
            Alert.alert(
                'Payment Error',
                'There was a problem processing your payment. Please try again.',
                [{ text: 'OK' }]
            );
            return false;
        }
    }

    private handlePaymentError(error: any) {
        switch (error.code) {
            case 'Canceled':
                // User canceled - no need for alert
                break;
                
            case 'Failed':
                Alert.alert(
                    'Payment Failed',
                    'Your card was declined. Please try another card.',
                    [{ text: 'OK' }]
                );
                break;
                
            case 'InvalidRequestError':
                Alert.alert(
                    'Invalid Request',
                    'There was a problem processing your payment. Please try again.',
                    [{ text: 'OK' }]
                );
                break;
                
            default:
                Alert.alert(
                    'Payment Error',
                    'An unexpected error occurred. Please try again.',
                    [{ text: 'OK' }]
                );
        }
    }

    // Test card numbers for different scenarios
    static readonly TEST_CARDS = {
        success: '4242424242424242',
        requiresAuth: '4000002500003155', // 3D Secure
        declined: '4000000000009995',     // Insufficient funds
        expired: '4000000000000069',      // Expired card
        incorrect_cvc: '4000000000000127', // CVC check fails
        processing_error: '4000000000000119' // Processing error
    };
} 