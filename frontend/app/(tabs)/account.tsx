import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Shadows, Spacing } from '../../src/constants/colors';
import { useAuthStore } from '../../src/stores/useAuthStore';

export default function AccountScreen() {
  const router = useRouter();
  const { isLoggedIn, user, logout } = useAuthStore();
  const menu = [
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
        <View style={styles.header}><Text style={styles.title}>Account</Text></View>
        {isLoggedIn ? (
          <View style={styles.profileCard}>
            <View style={styles.avatar}><Ionicons name="person" size={26} color={Colors.primary} /></View>
            <View><Text style={styles.profileName}>{user?.first_name} {user?.last_name}</Text><Text style={styles.profileEmail}>{user?.email}</Text></View>
          </View>
        ) : (
          <View style={styles.guestCard}>
            <Ionicons name="person-circle-outline" size={56} color={Colors.textDisabled} />
            <Text style={styles.guestTitle}>Welcome to Bharat Pansari</Text>
            <Text style={styles.guestSub}>Login or register to manage orders</Text>
            <View style={styles.authBtns}>
              <TouchableOpacity testID="login-btn" style={styles.loginBtn} onPress={() => router.push('/login')}><Text style={styles.loginBtnText}>Login</Text></TouchableOpacity>
              <TouchableOpacity testID="register-btn" style={styles.registerBtn} onPress={() => router.push('/register')}><Text style={styles.registerBtnText}>Register</Text></TouchableOpacity>
            </View>
          </View>
        )}
        <View style={styles.menuCard}>
          {menu.map((m, i) => (
            <TouchableOpacity key={i} testID={`menu-${m.label.toLowerCase().replace(/\s+/g, '-')}`} style={styles.menuItem}
              onPress={() => m.route ? router.push(m.route as any) : null}>
              <View style={styles.menuLeft}>
                <View style={styles.menuIcon}><Ionicons name={m.icon} size={18} color={Colors.primary} /></View>
                <Text style={styles.menuLabel}>{m.label}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={Colors.textDisabled} />
            </TouchableOpacity>
          ))}
        </View>
        {isLoggedIn && (
          <TouchableOpacity testID="logout-btn" style={styles.logoutBtn} onPress={logout}>
            <Ionicons name="log-out-outline" size={18} color={Colors.error} /><Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        )}
        <View style={styles.versionWrap}><Text style={styles.versionText}>Bharat Pansari v1.0.0</Text></View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: Spacing.base, paddingVertical: Spacing.base },
  title: { fontSize: 26, fontWeight: '800', color: Colors.textPrimary },
  profileCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.card, marginHorizontal: Spacing.base, padding: Spacing.base, borderRadius: Radius.xl, ...Shadows.sm },
  avatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center', marginRight: Spacing.md },
  profileName: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  profileEmail: { fontSize: 13, color: Colors.textMuted, marginTop: 2 },
  guestCard: { backgroundColor: Colors.card, marginHorizontal: Spacing.base, padding: Spacing.xl, borderRadius: Radius.xl, alignItems: 'center', ...Shadows.sm },
  guestTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary, marginTop: Spacing.md },
  guestSub: { fontSize: 13, color: Colors.textMuted, marginTop: 4, marginBottom: Spacing.base },
  authBtns: { flexDirection: 'row', gap: 12 },
  loginBtn: { backgroundColor: Colors.primary, paddingHorizontal: 28, paddingVertical: 12, borderRadius: Radius.pill },
  loginBtnText: { color: Colors.textInverse, fontWeight: '600', fontSize: 14 },
  registerBtn: { backgroundColor: Colors.primaryLight, paddingHorizontal: 28, paddingVertical: 12, borderRadius: Radius.pill },
  registerBtnText: { color: Colors.primaryDark, fontWeight: '600', fontSize: 14 },
  menuCard: { marginTop: Spacing.xl, marginHorizontal: Spacing.base, backgroundColor: Colors.card, borderRadius: Radius.xl, overflow: 'hidden', ...Shadows.sm },
  menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, paddingHorizontal: Spacing.base, borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  menuLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  menuIcon: { width: 32, height: 32, borderRadius: Radius.sm, backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center' },
  menuLabel: { fontSize: 14, fontWeight: '500', color: Colors.textPrimary },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginHorizontal: Spacing.base, marginTop: Spacing.lg, paddingVertical: 14, backgroundColor: Colors.errorLight, borderRadius: Radius.lg, gap: 8 },
  logoutText: { fontSize: 14, fontWeight: '600', color: Colors.error },
  versionWrap: { alignItems: 'center', marginTop: Spacing.xl, marginBottom: 20 },
  versionText: { fontSize: 11, color: Colors.textDisabled },
});
