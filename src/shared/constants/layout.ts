import { Platform } from 'react-native';

/**
 * Centralized layout constants for consistent spacing across the app
 */
export const LAYOUT_CONSTANTS = {
  // Tab bar dimensions
  TAB_BAR_HEIGHT: Platform.OS === 'ios' ? 83 : 52,
  TAB_BAR_PADDING_BOTTOM: 8,
  TAB_BAR_PADDING_TOP: Platform.OS === 'ios' ? 8 : 0,
  
  // Live session card spacing
  LIVE_SESSION_CARD_SPACING: Platform.OS === 'ios' ? 0 : 0,
  
  // Screen content padding
  SCREEN_HORIZONTAL_PADDING: 16,
  SCREEN_TOP_PADDING: Platform.OS === 'android' ? 16 : 0, // Android needs explicit top padding
  
  // Bottom padding for scrollable content (to account for tab bar + live session card)
  getContentBottomPadding: (hasLiveSession: boolean = false) => {
    const tabBarHeight = LAYOUT_CONSTANTS.TAB_BAR_HEIGHT;
    const liveSessionCardHeight = hasLiveSession ? 60 : 0; // Collapsed card height
    const liveSessionSpacing = hasLiveSession ? LAYOUT_CONSTANTS.LIVE_SESSION_CARD_SPACING : 0;
    

    const extraPadding = Platform.OS === 'ios' ? 20 : 0;  // Change Android from 20 to 5

    // Add extra padding for safety
    return tabBarHeight + liveSessionCardHeight + liveSessionSpacing + extraPadding;
  },
};

