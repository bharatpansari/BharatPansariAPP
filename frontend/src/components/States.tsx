import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Spacing } from '../constants/colors';

export function EmptyState({ icon, title, message }: { icon: keyof typeof Ionicons.glyphMap; title: string; message: string }) {
  return (
    <View style={styles.container} testID="empty-state">
      <View style={styles.iconCircle}><Ionicons name={icon} size={36} color={Colors.primary} /></View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

export function LoadingState() {
  return (
    <View style={styles.container} testID="loading-state">
      <ActivityIndicator size="large" color={Colors.primary} />
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  );
}

export function ErrorState({ message }: { message: string; onRetry?: () => void }) {
  return (
    <View style={styles.container} testID="error-state">
      <View style={[styles.iconCircle, { backgroundColor: Colors.errorLight }]}><Ionicons name="alert-circle-outline" size={36} color={Colors.error} /></View>
      <Text style={styles.title}>Something went wrong</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.xxxl },
  iconCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.base },
  title: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary, marginBottom: Spacing.sm, textAlign: 'center' },
  message: { fontSize: 14, color: Colors.textMuted, textAlign: 'center', lineHeight: 20 },
  loadingText: { marginTop: Spacing.md, fontSize: 14, color: Colors.textMuted },
});
