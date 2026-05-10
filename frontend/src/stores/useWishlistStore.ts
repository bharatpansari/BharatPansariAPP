import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WishlistItem, Product } from '../models/types';

interface WishlistStore {
  items: WishlistItem[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addToWishlist: (product) => {
        set((state) => {
          if (state.items.find(item => item.product_id === product.id)) return state;
          return {
            items: [...state.items, { product_id: product.id, product, added_at: new Date().toISOString() }],
          };
        });
      },

      removeFromWishlist: (productId) => {
        set((state) => ({ items: state.items.filter(item => item.product_id !== productId) }));
      },

      isInWishlist: (productId) => {
        return get().items.some(item => item.product_id === productId);
      },

      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: 'bharat-pansari-wishlist',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ items: state.items }),
    }
  )
);
