import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../src/constants/colors';
import { Config } from '../src/constants/config';
import { Ionicons } from '@expo/vector-icons';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/onboarding');
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container} testID="splash-screen">
      <View style={styles.logoContainer}>
        <View style={styles.iconCircle}>
          <Ionicons name="leaf" size={48} color={Colors.textInverse} />
        </View>
        <Text style={styles.brandName}>{Config.APP_NAME}</Text>
        <Text style={styles.tagline}>{Config.APP_TAGLINE}</Text>
      </View>
      <Text style={styles.footer}>Pure • Natural • Trusted</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  brandName: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.textInverse,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 8,
  },
  footer: {
    position: 'absolute',
    bottom: 60,
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: 2,
  },
});
