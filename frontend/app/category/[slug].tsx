import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../src/constants/colors';
import { Product } from '../../src/models/types';
import { apiClient } from '../../src/services/api';
import ProductCard from '../../src/components/ProductCard';
import { LoadingState, EmptyState } from '../../src/components/States';
import { mockCategories } from '../../src/constants/mockData';

export default function CategoryProductsScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const category = mockCategories.find(c => c.slug === slug);

  useEffect(() => {
    loadProducts();
  }, [slug]);

  const loadProducts = async () => {
    if (!slug) return;
    const response = await apiClient.getProducts(slug);
    if (response.success && response.data) {
      setProducts(response.data);
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity testID="category-back-btn" style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>{category?.name || 'Products'}</Text>
          <Text style={styles.headerCount}>{products.length} products</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity testID="sort-btn" style={styles.actionBtn}>
            <Ionicons name="swap-vertical" size={18} color={Colors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity testID="filter-btn" style={styles.actionBtn}>
            <Ionicons name="filter" size={18} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <LoadingState />
      ) : products.length === 0 ? (
        <EmptyState icon="cube-outline" title="No products" message="No products found in this category" />
      ) : (
        <FlatList
          data={products}
          numColumns={2}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.grid}
          renderItem={({ item }) => (
            <ProductCard product={item} onPress={() => router.push(`/product/${item.id}`)} />
          )}
        />
      )}
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
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  headerCount: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  grid: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
});
