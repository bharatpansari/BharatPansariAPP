# Bharat Pansari - Mobile Ecommerce App PRD

## Overview
Production-ready mobile ecommerce app for Bharat Pansari - a natural, herbal, Ayurvedic, and grocery/pansari-style products business. Built with Expo (React Native) using mock data layer ready to connect to WordPress + WooCommerce REST API.

## Architecture
- **Framework**: Expo SDK 54 + React Native + expo-router (file-based routing)
- **State Management**: Zustand (cart, wishlist, auth)
- **Navigation**: Bottom tab navigation (6 tabs) + Stack navigation for detail screens
- **Data Layer**: Auto-routing API client (web → proxy, native → direct WordPress)
- **Production API**: `https://bharatpansari.com/wp-json/bp-app/v1/`
- **Preview proxy**: `/api/wp/*` → FastAPI → WordPress (CORS bypass for web)
- **Design**: Google Stitch premium UI (emerald #10B981, orange #FF7A00)

## Screens Implemented
| Screen | Route | Status |
|--------|-------|--------|
| Splash | `/` (index.tsx) | ✅ Complete |
| Onboarding | `/onboarding` | ✅ Complete |
| Home | `/(tabs)/` | ✅ Complete |
| Categories | `/(tabs)/categories` | ✅ Complete |
| Search | `/(tabs)/search` | ✅ Complete |
| Wishlist | `/(tabs)/wishlist` | ✅ Complete |
| Cart | `/(tabs)/cart` | ✅ Complete |
| Account | `/(tabs)/account` | ✅ Complete |
| Product Detail | `/product/[id]` | ✅ Complete |
| Category Products | `/category/[slug]` | ✅ Complete |
| Login | `/login` | ✅ Complete (Mock) |
| Register | `/register` | ✅ Complete (Mock) |
| Orders | `/orders` | ✅ Placeholder |
| Privacy Policy | `/privacy-policy` | ✅ Complete |
| Terms & Conditions | `/terms` | ✅ Complete |
| Delete Account | `/delete-account` | ✅ Complete |

## Key Features
- Product browsing with categories, search, featured/new/popular sections
- Add to cart with quantity management
- Wishlist with move-to-cart functionality
- Mock authentication (ready for real API)
- Hero banner carousel
- Product detail with image gallery, specs, pricing
- Health/herbal disclaimer compliance
- App Store/Play Store submission-ready structure

## Data Models
- Product, Category, CartItem, WishlistItem, User, Order, Banner, HomePageData

## Security
- No WooCommerce keys exposed in app
- API base URL configurable via environment
- All mock data local (no direct WordPress DB connection)

## Phase 1A - Real API Integration (May 2026)
- Switched from mock data to real WordPress REST API via backend proxy
- Backend proxy at `/api/wp/*` forwards to `https://bharatpansari.com/wp-json/bp-app/v1/*`
- All product/category/search data now comes from live WooCommerce
- Safe handling for empty prices, missing images, empty descriptions
- Login/register remain mock for Phase 1A
- Cart/wishlist remain client-side Zustand

## Phase 2 Roadmap
- Connect real WordPress REST API
- Implement JWT authentication
- Payment gateway integration
- Push notifications
- Order tracking
