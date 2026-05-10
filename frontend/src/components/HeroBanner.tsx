import React, { useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, Dimensions, TouchableOpacity, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { Colors, Radius, Spacing } from '../constants/colors';
import { Banner } from '../models/types';

const { width: SW } = Dimensions.get('window');
const H_PADDING = 20;
const BANNER_H = 175;

export default function HeroBanner({ banners }: { banners: Banner[] }) {
  const [idx, setIdx] = useState(0);
  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => setIdx(Math.round(e.nativeEvent.contentOffset.x / SW));

  if (!banners || banners.length === 0) return null;

  return (
    <View testID="hero-banner" style={styles.wrap}>
      <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} onScroll={onScroll} scrollEventThrottle={16}>
        {banners.map((b) => (
          <View key={b.id} style={styles.page}>
            <View style={styles.bannerCard}>
              {b.image ? <Image source={{ uri: b.image }} style={styles.bannerImage} resizeMode="cover" /> : (
                <View style={[styles.bannerImage, { backgroundColor: Colors.primaryDark }]} />
              )}
              <View style={styles.overlay}>
                <View style={styles.offerBadge}><Text style={styles.offerBadgeText}>Limited Time Offer</Text></View>
                <Text style={styles.title} numberOfLines={1}>{b.title}</Text>
                <Text style={styles.subtitle} numberOfLines={2}>{b.subtitle}</Text>
                <TouchableOpacity style={styles.shopBtn}><Text style={styles.shopBtnText}>Shop Now</Text></TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
      <View style={styles.dots}>
        {banners.map((_, i) => <View key={i} style={[styles.dot, i === idx && styles.dotActive]} />)}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: Spacing.base, marginBottom: Spacing.md },
  page: { width: SW, paddingHorizontal: H_PADDING },
  bannerCard: { height: BANNER_H, borderRadius: Radius.xxl, overflow: 'hidden', backgroundColor: Colors.primaryDark },
  bannerImage: { width: '100%', height: '100%', position: 'absolute' },
  overlay: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: 'rgba(0,60,30,0.5)' },
  offerBadge: { backgroundColor: Colors.accent, alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.sm, marginBottom: 8 },
  offerBadgeText: { color: Colors.textInverse, fontSize: 10, fontWeight: '700' },
  title: { fontSize: 22, fontWeight: '800', color: '#FFFFFF', marginBottom: 2 },
  subtitle: { fontSize: 13, color: 'rgba(255,255,255,0.85)', marginBottom: 12 },
  shopBtn: { backgroundColor: '#FFFFFF', alignSelf: 'flex-start', paddingHorizontal: 18, paddingVertical: 8, borderRadius: Radius.pill },
  shopBtnText: { color: Colors.primaryDark, fontSize: 13, fontWeight: '700' },
  dots: { flexDirection: 'row', justifyContent: 'center', marginTop: 10, gap: 6 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.border },
  dotActive: { backgroundColor: Colors.primary, width: 20 },
});
