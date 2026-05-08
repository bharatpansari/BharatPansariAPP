import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Shadows, Spacing } from '../../src/constants/colors';
import { Config } from '../../src/constants/config';
import { HomePageData } from '../../src/models/types';
import { apiClient } from '../../src/services/api';
import HeroBanner from '../../src/components/HeroBanner';
import ProductCard from '../../src/components/ProductCard';
import CategoryCard from '../../src/components/CategoryCard';
import { LoadingState, ErrorState } from '../../src/components/States';

export default function HomeScreen() {
  const router = useRouter();
  const [homeData, setHomeData] = useState<HomePageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { loadData(); }, []);
  const loadData = async () => {
    setLoading(true);
    const r = await apiClient.getHome();
    if (r.success && r.data) setHomeData(r.data);
    else setError(r.error?.message || 'Failed to load');
    setLoading(false);
  };

  if (loading) return <SafeAreaView style={styles.container} edges={['top']}><LoadingState /></SafeAreaView>;
  if (error || !homeData) return <SafeAreaView style={styles.container} edges={['top']}><ErrorState message={error || 'Failed to load'} /></SafeAreaView>;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.locationIcon}><Ionicons name="location" size={16} color={Colors.primary} /></View>
            <Text style={styles.brandName}>{Config.APP_NAME}</Text>
          </View>
          <TouchableOpacity testID="notifications-btn" style={styles.profileBtn}>
            <Ionicons name="notifications-outline" size={20} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <TouchableOpacity testID="home-search-bar" style={styles.searchBar} onPress={() => router.push('/(tabs)/search')}>
          <Ionicons name="search" size={18} color={Colors.textDisabled} />
          <Text style={styles.searchPlaceholder}>Search for herbs, oils, spices</Text>
          <Ionicons name="options-outline" size={18} color={Colors.textMuted} />
        </TouchableOpacity>

        {/* Hero Banner */}
        <HeroBanner banners={homeData.banners} />

        {/* Category Circles */}
        {homeData.categories.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Categories</Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/categories')}><Text style={styles.viewAll}>View All</Text></TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
              {homeData.categories.slice(0, 6).map(cat => (
                <CategoryCard key={cat.id} category={cat} variant="circle" onPress={() => router.push(`/category/${cat.slug}`)} />
              ))}
            </ScrollView>
          </View>
        )}

        {/* Featured */}
        {homeData.featured_products.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>Featured</Text></View>
            <View style={styles.productGrid}>
              {homeData.featured_products.slice(0, 4).map(p => (
                <ProductCard key={p.id} product={p} onPress={() => router.push(`/product/${p.id}`)} />
              ))}
            </View>
          </View>
        )}

        {/* New Arrivals */}
        {homeData.new_arrivals.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>New Arrivals</Text></View>
            <View style={styles.productGrid}>
              {homeData.new_arrivals.slice(0, 4).map(p => (
                <ProductCard key={p.id} product={p} onPress={() => router.push(`/product/${p.id}`)} />
              ))}
            </View>
          </View>
        )}

        {/* Popular */}
        {homeData.popular_products.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>Popular Products</Text></View>
            <View style={styles.productGrid}>
              {homeData.popular_products.slice(0, 4).map(p => (
                <ProductCard key={p.id} product={p} onPress={() => router.push(`/product/${p.id}`)} />
              ))}
            </View>
          </View>
        )}

        {/* Disclaimer */}
        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>Information is for general wellness and educational purposes only. It is not medical advice. Please consult a qualified professional before use.</Text>
        </View>
        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.base, paddingVertical: Spacing.md },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  locationIcon: { width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center' },
  brandName: { fontSize: 22, fontWeight: '800', color: Colors.primaryDark },
  profileBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.card, alignItems: 'center', justifyContent: 'center', ...Shadows.sm },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.card, marginHorizontal: Spacing.base, borderRadius: Radius.pill, paddingHorizontal: Spacing.base, paddingVertical: 12, gap: 10, ...Shadows.sm },
  searchPlaceholder: { flex: 1, fontSize: 14, color: Colors.textDisabled },
  section: { marginTop: Spacing.xl },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.base, marginBottom: Spacing.md },
  sectionTitle: { fontSize: 20, fontWeight: '800', color: Colors.textPrimary },
  viewAll: { fontSize: 13, color: Colors.primary, fontWeight: '600' },
  categoryScroll: { paddingHorizontal: Spacing.base },
  productGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 10 },
  disclaimer: { marginHorizontal: Spacing.base, marginTop: Spacing.xl, padding: Spacing.base, backgroundColor: Colors.primarySurface, borderRadius: Radius.lg },
  disclaimerText: { fontSize: 11, color: Colors.textMuted, lineHeight: 16, textAlign: 'center' },
});
