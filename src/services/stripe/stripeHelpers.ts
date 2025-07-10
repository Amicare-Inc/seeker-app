import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

/**
 * Hook to get the current user's Stripe account ID
 * @returns The Stripe account ID or null if not set
 */
export const useStripeAccountId = (): string | null => {
    const userData = useSelector((state: RootState) => state.user.userData);
    return userData?.stripeAccountId || null;
};

/**
 * Check if user has completed Stripe onboarding
 * @returns boolean indicating if Stripe is set up
 */
export const useIsStripeSetup = (): boolean => {
    const stripeAccountId = useStripeAccountId();
    return Boolean(stripeAccountId);
};

/**
 * Utility function to format Stripe account display
 * @param accountId The Stripe account ID
 * @returns Formatted account string for display
 */
export const formatStripeAccountDisplay = (accountId: string): string => {
    return `acct_${accountId.replace('acct_', '').substring(0, 8)}...`;
};

/**
 * Get Stripe account ID from Redux state directly (for use outside components)
 * @param state Redux state
 * @returns Stripe account ID or null
 */
export const getStripeAccountId = (state: RootState): string | null => {
    return state.user.userData?.stripeAccountId || null;
}; 