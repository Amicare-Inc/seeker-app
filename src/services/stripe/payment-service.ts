import { Alert } from 'react-native';
import { EnrichedSession } from '@/types/EnrichedSession';

export class PaymentService {
    private static instance: PaymentService;
    private apiBaseUrl = process.env.EXPO_PUBLIC_BACKEND_BASE_URL;

    private constructor() {}

    static getInstance(): PaymentService {
        if (!PaymentService.instance) {
            PaymentService.instance = new PaymentService();
        }
        return PaymentService.instance;
    }

    async initiatePayment(session: EnrichedSession, stripe: any): Promise<boolean> {
        try {
            // 1. Create payment intent
            const response = await fetch(`${this.apiBaseUrl}/payments/create-intent`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: Math.round(session.billingDetails!.total * 100), // Convert to cents and round to avoid floating-point precision errors
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
            const { error: initError } = await stripe.initPaymentSheet({
                paymentIntentClientSecret: clientSecret,
                merchantDisplayName: 'Amicare',
                returnURL: 'amicare://stripe-redirect',
                // applePay: {
                //     merchantCountryCode: 'CA'
                // },
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
            const { error: presentError } = await stripe.presentPaymentSheet();

            if (presentError) {
                console.error('Payment error:', presentError);
                this.handlePaymentError(presentError);
                return false;
            }

            // 4. Verify payment status
            const verificationResult = await this.verifyPaymentStatus(clientSecret);
            if (!verificationResult.success) {
                console.error('Payment verification failed:', verificationResult.error);
                Alert.alert(
                    'Payment Error',
                    verificationResult.error || 'Payment could not be verified. Please try again.',
                    [{ text: 'OK' }]
                );
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

    private async verifyPaymentStatus(clientSecret: string): Promise<{success: boolean, error?: string}> {
        try {
            // Give webhook time to process
            await new Promise(resolve => setTimeout(resolve, 2000));

            const response = await fetch(`${this.apiBaseUrl}/payments/verify-status`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ clientSecret })
            });

            if (!response.ok) {
                const errorData = await response.json();
                return { success: false, error: errorData.message || 'Payment verification failed' };
            }

            const { status } = await response.json();
            
            if (status === 'succeeded') {
                return { success: true };
            } else {
                return { 
                    success: false, 
                    error: `Payment status: ${status}. Please try again.`
                };
            }
        } catch (error) {
            console.error('Error verifying payment status:', error);
            return { success: false, error: 'Unable to verify payment status. Please contact support.' };
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