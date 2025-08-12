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

    private buildBackendUrl(path: string): string {
        const base = this.apiBaseUrl;
        if (!base) {
            throw new Error('Backend base URL is not set (EXPO_PUBLIC_BACKEND_BASE_URL)');
        }
        try {
            return new URL(path, base).toString();
        } catch {
            throw new Error(`Invalid EXPO_PUBLIC_BACKEND_BASE_URL: ${base}. Use a full HTTPS URL like https://your-api.example.com`);
        }
    }

    /**
     * Creates a Stripe Express account and returns onboarding URL
     */
    async createExpressAccount(
        userId: string,
        email: string,
        firstName: string,
        lastName: string,
        dob: string,
        street: string,
        phone: string,
        city: string,
        province: string,
        country: string,
        postalCode: string
    ): Promise<CreateExpressAccountResponse> {
        try {
            const returnUrl = this.buildBackendUrl('/payments/stripe/onboarding-return');
            const refreshUrl = this.buildBackendUrl('/payments/stripe/onboarding-refresh');
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
                    returnUrl,
                    refreshUrl,
                }),
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
                headers: { 'Content-Type': 'application/json' },
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
            const returnUrl = this.buildBackendUrl('/payments/stripe/onboarding-return');
            const refreshUrl = this.buildBackendUrl('/payments/stripe/onboarding-refresh');
            const response = await fetch(`${this.apiBaseUrl}/payments/stripe/refresh-onboarding/${accountId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    returnUrl,
                    refreshUrl,
                }),
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

    /**
     * Requests an Identity verification session link for the connected account
     */
    async getIdentityVerificationLink(accountId: string): Promise<{ verificationUrl: string }> {
        try {
            const response = await fetch(`${this.apiBaseUrl}/payments/stripe/identity-link/${accountId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create identity verification link');
            }

            return await response.json();
        } catch (error) {
            console.error('Error creating identity verification link:', error);
            throw error;
        }
    }
} 