import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Shadows } from '../../src/constants/colors';
import { useCartStore } from '../../src/stores/useCartStore';
import { useWishlistStore } from '../../src/stores/useWishlistStore';

const TAB_BASE_HEIGHT = 58;

function Badge({ count }: { count: number }) {
  if (count <= 0) return null;
  return <View style={styles.badge}><Text style={styles.badgeText}>{count}</Text></View>;
}

export default function TabLayout() {
  const cartCount = useCartStore(s => s.getItemCount());
  const wishlistCount = useWishlistStore(s => s.items.length);
  const { bottom } = useSafeAreaInsets();

  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: Colors.primary,
      tabBarInactiveTintColor: Colors.textDisabled,
      tabBarStyle: {
        backgroundColor: Colors.card,
        borderTopWidth: 0,
        height: TAB_BASE_HEIGHT + bottom,
        paddingBottom: bottom,
        paddingTop: 8,
        ...Shadows.md,
      },
      tabBarLabelStyle: { fontSize: 10, fontWeight: '500', marginTop: 2 },
    }}>
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: ({ color }) => <Ionicons name="home" size={22} color={color} /> }} />
      <Tabs.Screen name="categories" options={{ title: 'Categories', tabBarIcon: ({ color }) => <Ionicons name="grid" size={22} color={color} /> }} />
      <Tabs.Screen name="search" options={{ title: 'Search', tabBarIcon: ({ color }) => <Ionicons name="search" size={22} color={color} /> }} />
      <Tabs.Screen name="wishlist" options={{ title: 'Wishlist', tabBarIcon: ({ color }) => (
        <View><Ionicons name="heart" size={22} color={color} /><Badge count={wishlistCount} /></View>
      )}} />
      <Tabs.Screen name="cart" options={{ title: 'Cart', tabBarIcon: ({ color }) => (
        <View><Ionicons name="bag" size={22} color={color} /><Badge count={cartCount} /></View>
      )}} />
      <Tabs.Screen name="account" options={{ title: 'Account', tabBarIcon: ({ color }) => <Ionicons name="person" size={22} color={color} /> }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  badge: { position: 'absolute', top: -4, right: -10, backgroundColor: Colors.accent, borderRadius: 8, minWidth: 16, height: 16, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 },
  badgeText: { color: '#FFF', fontSize: 9, fontWeight: '700' },
});
