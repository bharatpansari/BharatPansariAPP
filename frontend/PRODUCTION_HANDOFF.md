# Bharat Pansari — Production Readiness Handoff

## 1. API Flow Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                     API ROUTING (Auto-Detect)                    │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  WEB PREVIEW (Emergent browser)                                  │
│  ┌──────────┐     ┌─────────────────┐     ┌──────────────────┐  │
│  │ React    │────▶│ /api/wp/*       │────▶│ bharatpansari.com│  │
│  │ (web)    │     │ FastAPI proxy   │     │ WordPress API    │  │
│  └──────────┘     │ (same-origin)   │     └──────────────────┘  │
│                   └─────────────────┘                            │
│                   Bypasses CORS                                  │
│                                                                  │
│  PRODUCTION MOBILE (Expo Go / APK / IPA)                         │
│  ┌──────────┐                            ┌──────────────────┐   │
│  │ React    │───────────────────────────▶│ bharatpansari.com│   │
│  │ Native   │      Direct HTTPS          │ WordPress API    │   │
│  └──────────┘      (no CORS on native)   └──────────────────┘   │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

**How it works:** `Config.API_BASE_URL` is a computed getter in `src/constants/config.ts`:
- `Platform.OS === 'web'` → returns `PROXY_BASE_URL + /api/wp` (Emergent proxy)
- `Platform.OS === 'ios' | 'android'` → returns `https://bharatpansari.com/wp-json/bp-app/v1` (direct)

**Zero config needed.** The app auto-detects at runtime.

---

## 2. Config Location & Production Instructions

### File: `src/constants/config.ts`

| Setting | Preview (Web) | Production (Mobile) |
|---------|---------------|---------------------|
| API URL | `{PROXY_BASE_URL}/api/wp` | `https://bharatpansari.com/wp-json/bp-app/v1` |
| Auto-detected? | ✅ Yes | ✅ Yes |
| Proxy needed? | Yes (CORS) | No (native HTTP) |
| Secrets stored? | None | None |

### To force direct API for testing on mobile:
No action needed. `Platform.OS` returns `'ios'` or `'android'` on native → direct URL used.

### To change the WordPress domain:
Edit `WP_BASE_URL` in `src/constants/config.ts`:
```typescript
WP_BASE_URL: 'https://your-new-domain.com',
```

---

## 3. Security Audit

| Check | Status |
|-------|--------|
| WooCommerce consumer key in app? | ✅ None |
| WordPress admin credentials? | ✅ None |
| Database credentials? | ✅ None |
| JWT secrets? | ✅ None |
| API keys in code? | ✅ None |
| All endpoints public read-only? | ✅ Yes |
| HTTPS only? | ✅ Yes |

---

## 4. Full Frontend File Map

```
frontend/
├── app.json                          # Expo config, splash, branding
├── .env                              # Env vars (Emergent-managed, not for prod)
│
├── app/                              # SCREENS (expo-router file-based routing)
│   ├── _layout.tsx                   # Root layout, font loading, Stack navigator
│   ├── index.tsx                     # Splash screen (auto-redirect to onboarding)
│   ├── onboarding.tsx                # 3-slide intro → tabs
│   │
│   ├── (tabs)/                       # Bottom tab navigation group
│   │   ├── _layout.tsx               # Tab bar config, badges, styling
│   │   ├── index.tsx                 # HOME — banners, categories, products
│   │   ├── categories.tsx            # CATEGORIES — grid of all categories
│   │   ├── search.tsx                # SEARCH — input, popular chips, results
│   │   ├── wishlist.tsx              # WISHLIST — saved items, move to cart
│   │   ├── cart.tsx                  # CART — items, qty, coupon, summary, checkout
│   │   └── account.tsx               # ACCOUNT — guest/auth, menu, settings links
│   │
│   ├── product/
│   │   └── [id].tsx                  # PRODUCT DETAIL — gallery, price, add to cart
│   ├── category/
│   │   └── [slug].tsx                # CATEGORY PRODUCTS — filtered product list
│   │
│   ├── login.tsx                     # LOGIN — mock auth UI
│   ├── register.tsx                  # REGISTER — mock auth UI
│   ├── orders.tsx                    # ORDERS — empty state placeholder
│   ├── privacy-policy.tsx            # PRIVACY POLICY — static content
│   ├── terms.tsx                     # TERMS & CONDITIONS — static content
│   └── delete-account.tsx            # DELETE ACCOUNT — confirmation flow
│
├── src/                              # BUSINESS LOGIC & SHARED CODE
│   ├── constants/
│   │   ├── colors.ts                 # Design tokens: Colors, Spacing, Radius, Shadows
│   │   ├── config.ts                 # API config, branding, feature flags
│   │   └── mockData.ts              # Mock data (12 products, 8 categories, 3 banners)
│   │
│   ├── models/
│   │   └── types.ts                  # TypeScript interfaces: Product, Category, Cart, etc.
│   │
│   ├── services/
│   │   └── api.ts                    # API client: auto-routes web/native, sanitization
│   │
│   ├── stores/
│   │   ├── useAuthStore.ts           # Auth state (mock: user, token, login/logout)
│   │   ├── useCartStore.ts           # Cart state (add, remove, updateQty, total)
│   │   └── useWishlistStore.ts       # Wishlist state (add, remove, isInWishlist)
│   │
│   └── components/
│       ├── ProductCard.tsx            # Product card (grid + horizontal variants)
│       ├── CategoryCard.tsx           # Category card (circle, chip, grid variants)
│       ├── HeroBanner.tsx             # Hero banner carousel with offer badges
│       └── States.tsx                 # EmptyState, LoadingState, ErrorState
│
├── assets/
│   ├── fonts/
│   │   └── Ionicons.ttf              # Pre-bundled Ionicons font for Expo Go
│   └── images/                       # App icons and splash assets
│
└── backend/ (separate)
    └── server.py                     # FastAPI proxy (/api/wp/*) + existing endpoints
```

---

## 5. Screen-by-Screen Audit & Improvement List

### 5.1 Splash (`app/index.tsx`)
**Current:** Emerald green background, "BP" logo, "VITALITY REIMAGINED", auto-redirects in 2.2s.
**Files:** `app/index.tsx`
**Issues:**
- [ ] No skip-if-returning-user logic (shows every app launch)
- [ ] No animated transition (just a timeout)
- [ ] Logo is text-only "BP" — needs real brand logo asset
**Recommended tasks:**
1. Add AsyncStorage flag to skip splash+onboarding after first launch
2. Replace "BP" text with actual logo image when brand provides it

### 5.2 Onboarding (`app/onboarding.tsx`)
**Current:** 3 slides (icons + text), Skip/Next buttons, dot indicators.
**Files:** `app/onboarding.tsx`
**Issues:**
- [ ] Slide content may not render on web (horizontal ScrollView height issue)
- [ ] No illustration images — icon-only slides look basic
- [ ] Shows every app launch (no "seen" persistence)
**Recommended tasks:**
1. Add first-launch persistence (AsyncStorage)
2. Replace icon-only slides with product lifestyle images
3. Fix web ScrollView height for slide content

### 5.3 Home (`app/(tabs)/index.tsx`)
**Current:** Header, search, banner carousel, category circles, New Arrivals, Popular Products, disclaimer.
**Files:** `app/(tabs)/index.tsx`, `HeroBanner.tsx`, `ProductCard.tsx`, `CategoryCard.tsx`
**Issues:**
- [ ] No pull-to-refresh
- [ ] Banner carousel has no auto-scroll
- [ ] Featured section hidden (0 items from API) — fine, but no fallback section
- [ ] Only shows 4 products per section — no "View All" → full listing
- [ ] No skeleton/shimmer loading placeholders
- [ ] Product images from WordPress may load slowly — no progressive loading
- [ ] Horizontal ScrollView for categories clips on small screens
**Recommended tasks:**
1. Add pull-to-refresh (RefreshControl)
2. Add banner auto-scroll with interval
3. Add "View All" navigation for each product section
4. Add skeleton placeholders while loading
5. Add image caching/progressive loading

### 5.4 Categories (`app/(tabs)/categories.tsx`)
**Current:** 2-column grid of categories with circular images.
**Files:** `app/(tabs)/categories.tsx`, `CategoryCard.tsx`
**Issues:**
- [ ] No subcategory support (flat list only)
- [ ] No pull-to-refresh
- [ ] Categories don't show product count from real API accurately on some
**Recommended tasks:**
1. Add pull-to-refresh
2. Add subcategory hierarchy if WordPress returns child categories

### 5.5 Category Products (`app/category/[slug].tsx`)
**Current:** Back nav, category name, product count, sort/filter buttons (non-functional), product grid.
**Files:** `app/category/[slug].tsx`, `ProductCard.tsx`
**Issues:**
- [ ] Sort button is placeholder — not wired
- [ ] Filter button is placeholder — not wired
- [ ] No pagination (loads first 50 products only)
- [ ] No pull-to-refresh
- [ ] Category name derived from slug (title-cased), not from API
**Recommended tasks:**
1. Implement sort (price low/high, newest, popularity)
2. Add pagination (infinite scroll or "Load More")
3. Get category name from API response or pass via route params
4. Add pull-to-refresh

### 5.6 Product Detail (`app/product/[id].tsx`)
**Current:** Image gallery, rating, name, price/discount, stock, description, qty selector, attributes, disclaimer, bottom bar (wishlist + Add to Cart).
**Files:** `app/product/[id].tsx`
**Issues:**
- [ ] Image carousel dots overlap if many images
- [ ] No related products section (data exists in API but not rendered)
- [ ] No "Share" functionality (button exists but no action)
- [ ] No reviews section
- [ ] Quantity selector doesn't show variant/attribute selection
- [ ] HTML in description not parsed (shows raw text)
- [ ] No "Added to cart" confirmation toast/feedback
**Recommended tasks:**
1. Add related products section at bottom
2. Add cart confirmation toast/snackbar when item added
3. Parse HTML description or strip tags cleanly
4. Wire share button with React Native Share API
5. Add attribute/variant selection UI when applicable

### 5.7 Search (`app/(tabs)/search.tsx`)
**Current:** Pill search input, popular chips, results grid, empty state.
**Files:** `app/(tabs)/search.tsx`
**Issues:**
- [ ] No recent searches persistence
- [ ] No debounced search-as-you-type
- [ ] No search suggestions/autocomplete
- [ ] Results show in grid — could benefit from a list toggle
**Recommended tasks:**
1. Add recent searches (AsyncStorage)
2. Add debounced search with 300ms delay
3. Add search result count display

### 5.8 Cart (`app/(tabs)/cart.tsx`)
**Current:** Item cards, qty controls, Offers & Benefits (coupon placeholder), Price Summary, Proceed to Checkout.
**Files:** `app/(tabs)/cart.tsx`, `useCartStore.ts`
**Issues:**
- [ ] Cart is in-memory only — lost on app restart
- [ ] Coupon "APPLY" button is non-functional (placeholder)
- [ ] "Proceed to Checkout" has no action
- [ ] No cart item swipe-to-delete
- [ ] Tax calculation is missing (shows only subtotal)
- [ ] No "Continue Shopping" button from empty cart
**Recommended tasks:**
1. Persist cart to AsyncStorage
2. Add "Continue Shopping" button on empty cart state
3. Wire checkout button to checkout flow (Phase 2)
4. Add swipe-to-delete gesture

### 5.9 Wishlist (`app/(tabs)/wishlist.tsx`)
**Current:** Item cards, "Move to Cart" green button, red trash remove button, empty state.
**Files:** `app/(tabs)/wishlist.tsx`, `useWishlistStore.ts`
**Issues:**
- [ ] Wishlist is in-memory only — lost on app restart
- [ ] No "Continue Shopping" button from empty wishlist
**Recommended tasks:**
1. Persist wishlist to AsyncStorage
2. Add "Continue Shopping" button on empty state

### 5.10 Account (`app/(tabs)/account.tsx`)
**Current:** Guest card with Login/Register, menu (Orders, Addresses, Privacy, Terms, Delete, Support).
**Files:** `app/(tabs)/account.tsx`, `useAuthStore.ts`
**Issues:**
- [ ] "Addresses" menu item has no action (null route)
- [ ] "Contact Support" has no action (null route)
- [ ] Auth is fully mock — login always succeeds
- [ ] No profile edit screen
- [ ] No avatar image support
**Recommended tasks:**
1. Wire Addresses to a new address screen
2. Wire Contact Support (open email/WhatsApp)
3. Implement real WordPress JWT auth (Phase 2)
4. Add profile edit screen

### 5.11 Login (`app/login.tsx`)
**Current:** Email/password form, eye toggle, validation, green Login button, Register link.
**Files:** `app/login.tsx`, `useAuthStore.ts`, `api.ts`
**Issues:**
- [ ] Auth is mock — any email+password works
- [ ] No forgot password link
- [ ] No social login option
**Recommended tasks:**
1. Connect to real WordPress JWT login (Phase 2)
2. Add "Forgot Password?" link
3. Add social login if WordPress plugin supports it

### 5.12 Register (`app/register.tsx`)
**Current:** First/Last name, email, password form, Create Account button, T&C agreement.
**Files:** `app/register.tsx`
**Issues:**
- [ ] Auth is mock — registration always succeeds
- [ ] No password strength indicator
- [ ] T&C agreement checkbox not enforced (text-only)
**Recommended tasks:**
1. Connect to real WordPress registration (Phase 2)
2. Add T&C checkbox requirement before submit
3. Add password strength visual indicator

### 5.13 Orders (`app/orders.tsx`)
**Current:** "No orders yet" empty state.
**Files:** `app/orders.tsx`
**Issues:**
- [ ] Completely placeholder — no order list UI
- [ ] No order detail screen
**Recommended tasks:**
1. Build order list UI with status badges (Phase 2)
2. Build order detail screen with item list

### 5.14 Privacy/Terms/Delete (`privacy-policy.tsx`, `terms.tsx`, `delete-account.tsx`)
**Current:** Static content screens with back navigation.
**Files:** `app/privacy-policy.tsx`, `app/terms.tsx`, `app/delete-account.tsx`
**Issues:**
- [ ] Content is placeholder — needs real legal text
- [ ] Delete Account button has no action
**Recommended tasks:**
1. Replace with real legal content from Bharat Pansari
2. Wire delete account to real API (Phase 2)

---

## 6. Files Changed in This Handoff

| File | Change |
|------|--------|
| `src/constants/config.ts` | Rewritten: auto-detect web/native, `Platform.OS` getter, documented comments |
| `src/services/api.ts` | Refactored: simplified baseUrl getter using Config.API_BASE_URL, cleaner comments |

**Total: 2 files changed.** No new dependencies. No screen behavior changes.

---

## 7. Recommended Next Codex Tasks (Priority Order)

### HIGH PRIORITY (UX critical)
1. **Cart/Wishlist persistence** — Save to AsyncStorage so data survives app restart
2. **Pull-to-refresh** — Add RefreshControl to Home, Categories, Category Products
3. **Cart confirmation toast** — Show feedback when product added to cart
4. **Related products on detail** — Render related_products section
5. **First-launch skip** — Persist onboarding completion, skip on subsequent launches

### MEDIUM PRIORITY (Polish)
6. **Skeleton loading placeholders** — Replace spinner with shimmer content placeholders
7. **Banner auto-scroll** — Auto-advance hero banner every 4 seconds
8. **Search debounce** — Debounce input with 300ms delay
9. **Recent searches** — Store last 10 searches in AsyncStorage
10. **HTML description parsing** — Strip HTML tags from product descriptions or render as rich text
11. **Share product** — Wire share button using React Native Share API

### LOWER PRIORITY (Before store submission)
12. **Real auth (WordPress JWT)** — Login, register, token persistence, protected routes
13. **Sort/filter** — Wire sort and filter on category product listing
14. **Pagination** — Infinite scroll for product lists
15. **Order list + detail screens** — Build when order API is ready
16. **Real legal content** — Replace Privacy/Terms placeholder text
17. **Push notifications** — FCM token registration
18. **Checkout flow** — Connect to WooCommerce payment gateway

---

*Generated: May 2026 — Bharat Pansari Production Readiness Handoff*
