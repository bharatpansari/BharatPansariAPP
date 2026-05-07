import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../src/constants/colors';
import { Config } from '../../src/constants/config';
import { HomePageData } from '../../src/models/types';
import { apiClient } from '../../src/services/api';
import HeroBanner from '../../src/components/HeroBanner';
import ProductCard from '../../src/components/ProductCard';
import CategoryCard from '../../src/components/CategoryCard';
import { LoadingState } from '../../src/components/States';

export default function HomeScreen() {
  const router = useRouter();
  const [homeData, setHomeData] = useState<HomePageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const response = await apiClient.getHome();
    if (response.success && response.data) {
      setHomeData(response.data);
    }
    setLoading(false);
  };

  if (loading) return <LoadingState />;
  if (!homeData) return null;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.brandName}>{Config.APP_NAME}</Text>
            <Text style={styles.tagline}>{Config.APP_TAGLINE}</Text>
          </View>
          <TouchableOpacity testID="notifications-btn" style={styles.notifBtn}>
            <Ionicons name="notifications-outline" size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <TouchableOpacity testID="home-search-bar" style={styles.searchBar} onPress={() => router.push('/(tabs)/search')}>
          <Ionicons name="search" size={18} color={Colors.textDisabled} />
          <Text style={styles.searchPlaceholder}>Search herbs, spices, wellness...</Text>
        </TouchableOpacity>

        {/* Hero Banner */}
        <HeroBanner banners={homeData.banners} />

        {/* Category Chips */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Shop by Category</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/categories')}>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipScroll}>
            {homeData.categories.slice(0, 6).map(cat => (
              <CategoryCard
                key={cat.id}
                category={cat}
                variant="chip"
                onPress={() => router.push(`/category/${cat.slug}`)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Featured Products */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Products</Text>
          </View>
          <View style={styles.productGrid}>
            {homeData.featured_products.slice(0, 4).map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onPress={() => router.push(`/product/${product.id}`)}
              />
            ))}
          </View>
        </View>

        {/* New Arrivals */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>New Arrivals</Text>
          </View>
          <View style={styles.productGrid}>
            {homeData.new_arrivals.slice(0, 4).map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onPress={() => router.push(`/product/${product.id}`)}
              />
            ))}
          </View>
        </View>

        {/* Popular Products */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular Products</Text>
          </View>
          <View style={styles.productGrid}>
            {homeData.popular_products.slice(0, 4).map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onPress={() => router.push(`/product/${product.id}`)}
              />
            ))}
          </View>
        </View>

        {/* Disclaimer */}
        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            Information is for general wellness and educational purposes only. It is not medical advice. Please consult a qualified professional before use.
          </Text>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  brandName: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.primary,
  },
  tagline: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  notifBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    marginHorizontal: 16,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  searchPlaceholder: {
    fontSize: 14,
    color: Colors.textDisabled,
  },
  section: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  viewAll: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '600',
  },
  chipScroll: {
    paddingHorizontal: 16,
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
  },
  disclaimer: {
    marginHorizontal: 16,
    marginTop: 24,
    padding: 16,
    backgroundColor: Colors.sectionAlt,
    borderRadius: 12,
  },
  disclaimerText: {
    fontSize: 11,
    color: Colors.textSecondary,
    lineHeight: 16,
    textAlign: 'center',
  },
});
