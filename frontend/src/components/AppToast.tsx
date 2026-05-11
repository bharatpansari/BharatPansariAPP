import React, { useEffect, useRef } from 'react';
import { Animated, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Shadows } from '../constants/colors';
import { useToastStore } from '../stores/useToastStore';

const DURATION = 2500;
const FADE_MS = 250;

export default function AppToast() {
  const { message, visible, hide } = useToastStore();
  const opacity = useRef(new Animated.Value(0)).current;
  const timer = useRef<number | undefined>(undefined);
  const router = useRouter();

  useEffect(() => {
    if (visible) {
      Animated.timing(opacity, { toValue: 1, duration: FADE_MS, useNativeDriver: true }).start();
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        Animated.timing(opacity, { toValue: 0, duration: FADE_MS, useNativeDriver: true }).start(() => hide());
      }, DURATION);
    }
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [visible, message]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, { opacity }]} pointerEvents="box-none">
      <TouchableOpacity
        style={styles.toast}
        activeOpacity={0.85}
        onPress={() => { hide(); router.push('/(tabs)/cart'); }}
      >
        <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" />
        <Text style={styles.text} numberOfLines={1}>{message}</Text>
        <Text style={styles.action}>View Cart</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    alignItems: 'center',
    zIndex: 9999,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryDark,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: Radius.pill,
    gap: 8,
    ...Shadows.md,
  },
  text: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  action: {
    color: Colors.accent,
    fontSize: 12,
    fontWeight: '700',
  },
});
