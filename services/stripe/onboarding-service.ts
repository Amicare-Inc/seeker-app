interface CreateExpressAccountResponse {
    accountId: string;
    onboardingUrl: string;
}

interface OnboardingStatusResponse {
    accountId: string;
    isOnboardingComplete: boolean;
    chargesEnabled: boolean;
    payoutsEnabled: boolean;
}

export class StripeOnboardingService {
    private static instance: StripeOnboardingService;
    private apiBaseUrl = process.env.EXPO_PUBLIC_BACKEND_BASE_URL;

    private constructor() {}

    static getInstance(): StripeOnboardingService {
        if (!StripeOnboardingService.instance) {
            StripeOnboardingService.instance = new StripeOnboardingService();
        }
        return StripeOnboardingService.instance;
    }

    /**
     * Creates a Stripe Express account and returns onboarding URL
     */
    async createExpressAccount(userId: string, email: string, firstName: string, lastName: string, dob: string, street: string, phone: string, city: string, province: string, country: string, postalCode: string): Promise<CreateExpressAccountResponse> {
        try {
            const response = await fetch(`${this.apiBaseUrl}/payments/stripe/create-express-account`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    userId,
                    email,
                    firstName,
                    lastName,
                    dob,
                    street,
                    phone,
                    city,
                    province,
                    country,
                    postalCode,
                    returnUrl: 'https://amicare.app/stripe-onboarding-complete',
                    refreshUrl: 'https://amicare.app/stripe-onboarding-refresh'
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create Express account');
            }

            return await response.json();
        } catch (error) {
            console.error('Error creating Express account:', error);
            throw error;
        }
    }

    /**
     * Checks the onboarding status of a Stripe Express account
     */
    async getOnboardingStatus(accountId: string): Promise<OnboardingStatusResponse> {
        try {
            const response = await fetch(`${this.apiBaseUrl}/payments/stripe/onboarding-status/${accountId}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to get onboarding status');
            }

            return await response.json();
        } catch (error) {
            console.error('Error checking onboarding status:', error);
            throw error;
        }
    }

    /**
     * Creates a new onboarding link for an existing Express account
     */
    async refreshOnboardingUrl(accountId: string): Promise<{ onboardingUrl: string }> {
        try {
            const response = await fetch(`${this.apiBaseUrl}/payments/stripe/refresh-onboarding/${accountId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    returnUrl: 'https://amicare.app/stripe-onboarding-complete',
                    refreshUrl: 'https://amicare.app/stripe-onboarding-refresh'
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to refresh onboarding URL');
            }

            return await response.json();
        } catch (error) {
            console.error('Error refreshing onboarding URL:', error);
            throw error;
        }
    }
} 