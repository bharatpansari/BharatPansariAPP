import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../src/constants/colors';
import { useAuthStore } from '../src/stores/useAuthStore';
import { apiClient } from '../src/services/api';

export default function RegisterScreen() {
  const router = useRouter();
  const { login, setLoading } = useAuthStore();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async () => {
    if (!firstName.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all required fields');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setError('');
    setLoading(true);
    const response = await apiClient.register(email, password, firstName, lastName);
    setLoading(false);
    if (response.success && response.data) {
      login({ id: 1, email, first_name: firstName, last_name: lastName, avatar_url: '' }, response.data.token);
      router.back();
    } else {
      setError(response.error?.message || 'Registration failed');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity testID="register-close-btn" onPress={() => router.back()}>
            <Ionicons name="close" size={26} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.iconCircle}>
            <Ionicons name="person-add" size={28} color={Colors.primary} />
          </View>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join Bharat Pansari for natural wellness</Text>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <View style={styles.nameRow}>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>First Name *</Text>
              <View style={styles.inputRow}>
                <TextInput testID="register-firstname" style={styles.input} placeholder="First" placeholderTextColor={Colors.textDisabled} value={firstName} onChangeText={setFirstName} />
              </View>
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Last Name</Text>
              <View style={styles.inputRow}>
                <TextInput testID="register-lastname" style={styles.input} placeholder="Last" placeholderTextColor={Colors.textDisabled} value={lastName} onChangeText={setLastName} />
              </View>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email *</Text>
            <View style={styles.inputRow}>
              <Ionicons name="mail-outline" size={18} color={Colors.textDisabled} />
              <TextInput testID="register-email" style={styles.input} placeholder="your@email.com" placeholderTextColor={Colors.textDisabled} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password *</Text>
            <View style={styles.inputRow}>
              <Ionicons name="lock-closed-outline" size={18} color={Colors.textDisabled} />
              <TextInput testID="register-password" style={styles.input} placeholder="Min 6 characters" placeholderTextColor={Colors.textDisabled} value={password} onChangeText={setPassword} secureTextEntry />
            </View>
          </View>

          <TouchableOpacity testID="register-submit-btn" style={styles.submitBtn} onPress={handleRegister}>
            <Text style={styles.submitText}>Create Account</Text>
          </TouchableOpacity>

          <View style={styles.loginRow}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => { router.back(); router.push('/login'); }}>
              <Text style={styles.loginLink}>Login</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.disclaimer}>
            By creating an account, you agree to our Terms & Conditions and Privacy Policy.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: 16, paddingVertical: 8, alignItems: 'flex-end' },
  content: { flex: 1, paddingHorizontal: 24 },
  iconCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  title: { fontSize: 26, fontWeight: '800', color: Colors.textPrimary, marginBottom: 4 },
  subtitle: { fontSize: 14, color: Colors.textSecondary, marginBottom: 24 },
  error: { color: Colors.error, fontSize: 13, marginBottom: 12, backgroundColor: '#FEF2F2', padding: 10, borderRadius: 8 },
  nameRow: { flexDirection: 'row', gap: 12 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary, marginBottom: 6 },
  inputRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.card, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, gap: 10, borderWidth: 1, borderColor: Colors.border },
  input: { flex: 1, fontSize: 15, color: Colors.textPrimary },
  submitBtn: { backgroundColor: Colors.primary, borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginTop: 8 },
  submitText: { color: Colors.textInverse, fontSize: 16, fontWeight: '700' },
  loginRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  loginText: { fontSize: 14, color: Colors.textSecondary },
  loginLink: { fontSize: 14, color: Colors.primary, fontWeight: '600' },
  disclaimer: { fontSize: 11, color: Colors.textDisabled, textAlign: 'center', marginTop: 16, lineHeight: 16, marginBottom: 40 },
});
