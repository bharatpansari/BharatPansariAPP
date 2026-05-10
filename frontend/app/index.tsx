import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, Spacing } from '../src/constants/colors';
import { Config } from '../src/constants/config';

const ONBOARDING_KEY = 'bharat-pansari-onboarding-complete';

export default function SplashScreen() {
  const router = useRouter();
  useEffect(() => {
    let cancelled = false;
    const decide = async () => {
      let done = false;
      try {
        const val = await AsyncStorage.getItem(ONBOARDING_KEY);
        done = val === 'true';
      } catch { /* default to showing onboarding */ }
      await new Promise(r => setTimeout(r, 2000));
      if (!cancelled) router.replace(done ? '/(tabs)' : '/onboarding');
    };
    decide();
    return () => { cancelled = true; };
  }, []);

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
