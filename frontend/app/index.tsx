import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing } from '../src/constants/colors';
import { Config } from '../src/constants/config';

export default function SplashScreen() {
  const router = useRouter();
  useEffect(() => { const t = setTimeout(() => router.replace('/onboarding'), 2200); return () => clearTimeout(t); }, []);

  return (
    <View style={styles.container} testID="splash-screen">
      <View style={styles.logoCircle}>
        <Text style={styles.logoText}>BP</Text>
      </View>
      <Text style={styles.brandName}>{Config.APP_NAME}</Text>
      <Text style={styles.tagline}>VITALITY REIMAGINED</Text>
      <Text style={styles.footer}>Pure • Natural • Trusted</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  logoCircle: { width: 96, height: 96, borderRadius: 48, backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  logoText: { fontSize: 36, fontWeight: '800', color: '#FFFFFF' },
  brandName: { fontSize: 34, fontWeight: '800', color: '#FFFFFF', letterSpacing: -0.5 },
  tagline: { fontSize: 13, color: '#86EFAC', marginTop: 8, letterSpacing: 3, fontWeight: '500' },
  footer: { position: 'absolute', bottom: 56, fontSize: 12, color: 'rgba(255,255,255,0.5)', letterSpacing: 2 },
});
