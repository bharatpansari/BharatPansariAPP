import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../src/constants/colors';

export default function PrivacyPolicyScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity testID="privacy-back-btn" style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Privacy Policy</Text>
        <View style={{ width: 36 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.lastUpdated}>Last updated: February 2026</Text>
        <Text style={styles.heading}>1. Information We Collect</Text>
        <Text style={styles.body}>We collect personal information you provide when creating an account, placing orders, or contacting us. This includes name, email, phone number, and delivery address.</Text>
        <Text style={styles.heading}>2. How We Use Your Information</Text>
        <Text style={styles.body}>Your information is used to process orders, provide customer support, send order updates, and improve our services. We do not sell your personal data to third parties.</Text>
        <Text style={styles.heading}>3. Data Security</Text>
        <Text style={styles.body}>We implement industry-standard security measures to protect your data. All transactions are encrypted and processed through secure payment gateways.</Text>
        <Text style={styles.heading}>4. Your Rights</Text>
        <Text style={styles.body}>You have the right to access, correct, or delete your personal information. Contact us at support@bharatpansari.com for any privacy-related requests.</Text>
        <Text style={styles.heading}>5. Contact Us</Text>
        <Text style={styles.body}>If you have questions about this Privacy Policy, please contact us at support@bharatpansari.com</Text>
        <Text style={styles.placeholder}>[ Full privacy policy will be updated as per applicable laws and regulations ]</Text>
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
  placeholder: { fontSize: 13, color: Colors.textDisabled, fontStyle: 'italic', marginTop: 24, textAlign: 'center', padding: 16, backgroundColor: Colors.surface, borderRadius: 8 },
});
