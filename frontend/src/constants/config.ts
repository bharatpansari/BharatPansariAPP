import { Platform } from 'react-native';

// ═══════════════════════════════════════════════════════════
// Bharat Pansari — API Configuration
// ═══════════════════════════════════════════════════════════
//
// TWO MODES:
//
// 1. PREVIEW / WEB DEV (Emergent platform, browser preview)
//    → Uses backend proxy /api/wp/* to bypass CORS
//    → EXPO_PUBLIC_BACKEND_URL points to Emergent preview domain
//
// 2. PRODUCTION MOBILE (Expo Go, APK/IPA builds)
//    → Calls WordPress API directly (no CORS on native HTTP)
//    → https://bharatpansari.com/wp-json/bp-app/v1/*
//
// The app auto-detects: native → direct, web → proxy.
// No secrets are stored in the app. All endpoints are public read-only.
// ═══════════════════════════════════════════════════════════

const IS_WEB = Platform.OS === 'web';

export const Config = {
  // WordPress direct API (used by native mobile builds)
  WP_BASE_URL: 'https://bharatpansari.com',
  WP_API_NAMESPACE: '/wp-json/bp-app/v1',

  // Emergent proxy (used by web preview to bypass CORS)
  PROXY_BASE_URL: process.env.EXPO_PUBLIC_BACKEND_URL || '',
  PROXY_PREFIX: '/api/wp',

  // Auto-detect: web → proxy, native → direct WordPress
  get API_BASE_URL(): string {
    if (IS_WEB) {
      return (this.PROXY_BASE_URL + this.PROXY_PREFIX);
    }
    return (this.WP_BASE_URL + this.WP_API_NAMESPACE);
  },

  // Mock data toggle (false = real API)
  USE_MOCK: false,

  // App branding
  APP_NAME: 'Bharat Pansari',
  APP_TAGLINE: 'Natural & Herbal Products',
  CURRENCY_SYMBOL: '₹',
  ITEMS_PER_PAGE: 20,
  PLACEHOLDER_IMAGE: 'https://bharatpansari.com/wp-content/uploads/woocommerce-placeholder-300x300.png',
};
