import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../src/constants/colors';

export default function TermsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity testID="terms-back-btn" style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Terms & Conditions</Text>
        <View style={{ width: 36 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.lastUpdated}>Last updated: February 2026</Text>
        <Text style={styles.heading}>1. Acceptance of Terms</Text>
        <Text style={styles.body}>By using the Bharat Pansari app, you agree to these Terms & Conditions. If you do not agree, please do not use our services.</Text>
        <Text style={styles.heading}>2. Products & Descriptions</Text>
        <Text style={styles.body}>All product information is for general wellness and educational purposes only. We strive for accuracy but cannot guarantee all descriptions are complete or error-free. Product images are for illustration purposes.</Text>
        <Text style={styles.heading}>3. Orders & Payment</Text>
        <Text style={styles.body}>All orders are subject to availability and confirmation. Prices are in Indian Rupees (INR) and inclusive of applicable taxes unless stated otherwise.</Text>
        <Text style={styles.heading}>4. Shipping & Delivery</Text>
        <Text style={styles.body}>We aim to deliver within the estimated timeframe. Delays may occur due to unforeseen circumstances. Delivery charges may apply based on order value and location.</Text>
        <Text style={styles.heading}>5. Returns & Refunds</Text>
        <Text style={styles.body}>Returns are accepted within 7 days of delivery for eligible products in original condition. Refunds will be processed within 7-10 business days.</Text>
        <Text style={styles.heading}>6. Disclaimer</Text>
        <Text style={styles.body}>Products sold on Bharat Pansari are not intended to diagnose, treat, cure, or prevent any disease. Please consult a qualified healthcare professional before using any health-related products.</Text>
        <Text style={styles.placeholder}>[ Full terms and conditions will be updated as per applicable laws ]</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.card, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.borderLight },
  title: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary },
  content: { padding: 16, paddingBottom: 40 },
  lastUpdated: { fontSize: 12, color: Colors.textDisabled, marginBottom: 20 },
  heading: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary, marginTop: 20, marginBottom: 8 },
  body: { fontSize: 14, color: Colors.textSecondary, lineHeight: 22 },
  placeholder: { fontSize: 13, color: Colors.textDisabled, fontStyle: 'italic', marginTop: 24, textAlign: 'center', padding: 16, backgroundColor: Colors.sectionAlt, borderRadius: 8 },
});
