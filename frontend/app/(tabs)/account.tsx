import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../src/constants/colors';
import { useAuthStore } from '../../src/stores/useAuthStore';

export default function AccountScreen() {
  const router = useRouter();
  const { isLoggedIn, user, logout } = useAuthStore();

  const menuItems = [
    { icon: 'receipt-outline' as const, label: 'My Orders', route: '/orders' },
    { icon: 'location-outline' as const, label: 'Addresses', route: null },
    { icon: 'shield-checkmark-outline' as const, label: 'Privacy Policy', route: '/privacy-policy' },
    { icon: 'document-text-outline' as const, label: 'Terms & Conditions', route: '/terms' },
    { icon: 'trash-outline' as const, label: 'Delete Account', route: '/delete-account' },
    { icon: 'chatbubble-ellipses-outline' as const, label: 'Contact Support', route: null },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Account</Text>
        </View>

        {/* Profile / Guest State */}
        {isLoggedIn ? (
          <View style={styles.profileCard}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={28} color={Colors.primary} />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{user?.first_name} {user?.last_name}</Text>
              <Text style={styles.profileEmail}>{user?.email}</Text>
            </View>
          </View>
        ) : (
          <View style={styles.guestCard}>
            <View style={styles.guestIcon}>
              <Ionicons name="person-circle-outline" size={48} color={Colors.textDisabled} />
            </View>
            <Text style={styles.guestTitle}>Welcome to Bharat Pansari</Text>
            <Text style={styles.guestSubtitle}>Login or register to manage orders and wishlist</Text>
            <View style={styles.authButtons}>
              <TouchableOpacity testID="login-btn" style={styles.loginBtn} onPress={() => router.push('/login')}>
                <Text style={styles.loginBtnText}>Login</Text>
              </TouchableOpacity>
              <TouchableOpacity testID="register-btn" style={styles.registerBtn} onPress={() => router.push('/register')}>
                <Text style={styles.registerBtnText}>Register</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Menu Items */}
        <View style={styles.menu}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              testID={`menu-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
              style={styles.menuItem}
              onPress={() => item.route ? router.push(item.route as any) : null}
            >
              <View style={styles.menuLeft}>
                <View style={styles.menuIconCircle}>
                  <Ionicons name={item.icon} size={18} color={Colors.primary} />
                </View>
                <Text style={styles.menuLabel}>{item.label}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={Colors.textDisabled} />
            </TouchableOpacity>
          ))}
        </View>

        {isLoggedIn && (
          <TouchableOpacity testID="logout-btn" style={styles.logoutBtn} onPress={logout}>
            <Ionicons name="log-out-outline" size={18} color={Colors.error} />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        )}

        <View style={styles.versionInfo}>
          <Text style={styles.versionText}>Bharat Pansari v1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    marginLeft: 12,
  },
  profileName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  profileEmail: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  guestCard: {
    backgroundColor: Colors.card,
    marginHorizontal: 16,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  guestIcon: {
    marginBottom: 12,
  },
  guestTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  guestSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  authButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  loginBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 24,
  },
  loginBtnText: {
    color: Colors.textInverse,
    fontWeight: '600',
    fontSize: 14,
  },
  registerBtn: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 24,
  },
  registerBtnText: {
    color: Colors.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  menu: {
    marginTop: 24,
    marginHorizontal: 16,
    backgroundColor: Colors.card,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textPrimary,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginTop: 20,
    paddingVertical: 14,
    backgroundColor: Colors.accentLight,
    borderRadius: 12,
    gap: 8,
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.error,
  },
  versionInfo: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 20,
  },
  versionText: {
    fontSize: 11,
    color: Colors.textDisabled,
  },
});
