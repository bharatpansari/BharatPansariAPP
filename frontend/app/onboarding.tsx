import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Spacing } from '../src/constants/colors';

const { width: SW } = Dimensions.get('window');
const slides = [
  { icon: 'leaf' as const, title: 'Pure & Natural', desc: 'Discover authentic herbal, Ayurvedic, and natural products handpicked for your wellness.' },
  { icon: 'shield-checkmark' as const, title: 'Trusted Quality', desc: 'Every product is carefully sourced and quality-checked. From farm to your doorstep.' },
  { icon: 'bag-handle' as const, title: 'Easy Ordering', desc: 'Browse, add to cart, and order effortlessly. Fast delivery across India.' },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [active, setActive] = useState(0);
  const ref = useRef<ScrollView>(null);
  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => setActive(Math.round(e.nativeEvent.contentOffset.x / SW));
  const next = () => {
    if (active < slides.length - 1) ref.current?.scrollTo({ x: (active + 1) * SW, animated: true });
    else router.replace('/(tabs)');
  };

  return (
    <View style={styles.container} testID="onboarding-screen">
      <TouchableOpacity testID="skip-btn" style={styles.skipBtn} onPress={() => router.replace('/(tabs)')}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>
      <View style={{ flex: 1 }}>
        <ScrollView ref={ref} horizontal pagingEnabled showsHorizontalScrollIndicator={false} onScroll={onScroll} scrollEventThrottle={16}>
          {slides.map((s, i) => (
            <View key={i} style={[styles.slide, { width: SW }]}>
              <View style={styles.iconCircle}><Ionicons name={s.icon} size={52} color={Colors.primary} /></View>
              <Text style={styles.title}>{s.title}</Text>
              <Text style={styles.desc}>{s.desc}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
      <View style={styles.footer}>
        <View style={styles.dots}>{slides.map((_, i) => <View key={i} style={[styles.dot, i === active && styles.dotActive]} />)}</View>
        <TouchableOpacity testID="onboarding-next-btn" style={styles.nextBtn} onPress={next}>
          <Text style={styles.nextText}>{active === slides.length - 1 ? 'Get Started' : 'Next'}</Text>
          <Ionicons name="arrow-forward" size={18} color={Colors.textInverse} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  skipBtn: { position: 'absolute', top: 60, right: 24, zIndex: 10 },
  skipText: { fontSize: 15, color: Colors.textMuted, fontWeight: '500' },
  slide: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
  iconCircle: { width: 110, height: 110, borderRadius: 55, backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center', marginBottom: 36 },
  title: { fontSize: 28, fontWeight: '800', color: Colors.textPrimary, marginBottom: 14, textAlign: 'center' },
  desc: { fontSize: 15, color: Colors.textMuted, textAlign: 'center', lineHeight: 24 },
  footer: { paddingHorizontal: 24, paddingBottom: 48, alignItems: 'center' },
  dots: { flexDirection: 'row', marginBottom: 24, gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.border },
  dotActive: { backgroundColor: Colors.primary, width: 24 },
  nextBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.primary, paddingHorizontal: 32, paddingVertical: 16, borderRadius: Radius.pill, gap: 8 },
  nextText: { fontSize: 16, fontWeight: '600', color: Colors.textInverse },
});
