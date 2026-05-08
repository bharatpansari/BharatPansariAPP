import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../src/constants/colors';

export default function DeleteAccountScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity testID="delete-account-back-btn" style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Delete Account</Text>
        <View style={{ width: 36 }} />
      </View>
      <View style={styles.content}>
        <View style={styles.warningIcon}>
          <Ionicons name="warning-outline" size={48} color={Colors.error} />
        </View>
        <Text style={styles.heading}>Are you sure?</Text>
        <Text style={styles.body}>
          Deleting your account will permanently remove all your data including order history, saved addresses, and wishlist items. This action cannot be undone.
        </Text>
        <View style={styles.infoBox}>
          <Ionicons name="information-circle-outline" size={18} color={Colors.textSecondary} />
          <Text style={styles.infoText}>
            Account deletion requests are processed within 48 hours. You will receive a confirmation email once your account is deleted.
          </Text>
        </View>
        <TouchableOpacity testID="request-delete-btn" style={styles.deleteBtn}>
          <Text style={styles.deleteBtnText}>Request Account Deletion</Text>
        </TouchableOpacity>
        <TouchableOpacity testID="cancel-delete-btn" style={styles.cancelBtn} onPress={() => router.back()}>
          <Text style={styles.cancelBtnText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.card, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.borderLight },
  title: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary },
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 40, alignItems: 'center' },
  warningIcon: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#FEF2F2', alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  heading: { fontSize: 22, fontWeight: '700', color: Colors.textPrimary, marginBottom: 12 },
  body: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22, marginBottom: 24 },
  infoBox: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, backgroundColor: Colors.surface, padding: 14, borderRadius: 10, marginBottom: 32 },
  infoText: { flex: 1, fontSize: 12, color: Colors.textSecondary, lineHeight: 18 },
  deleteBtn: { backgroundColor: Colors.error, borderRadius: 14, paddingVertical: 16, paddingHorizontal: 32, width: '100%', alignItems: 'center', marginBottom: 12 },
  deleteBtnText: { color: Colors.textInverse, fontSize: 15, fontWeight: '700' },
  cancelBtn: { paddingVertical: 14, width: '100%', alignItems: 'center' },
  cancelBtnText: { color: Colors.textSecondary, fontSize: 15, fontWeight: '500' },
});
