import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Shadows, Spacing } from '../../src/constants/colors';
import { Product } from '../../src/models/types';
import { apiClient } from '../../src/services/api';
import ProductCard from '../../src/components/ProductCard';
import { LoadingState, EmptyState } from '../../src/components/States';

export default function CategoryProductsScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [categoryName, setCategoryName] = useState('');

  useEffect(() => { load(); }, [slug]);
  const load = async () => {
    if (!slug) return;
    setCategoryName(typeof slug === 'string' ? slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : 'Products');
    const r = await apiClient.getProducts(slug);
    if (r.success && r.data) setProducts(r.data);
    setLoading(false);
  };
  const onRefresh = async () => {
    if (!slug) return;
    setRefreshing(true);
    const r = await apiClient.getProducts(slug);
    if (r.success && r.data) setProducts(r.data);
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity testID="category-back-btn" style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>{categoryName || 'Products'}</Text>
          <Text style={styles.headerCount}>{products.length} products</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity testID="sort-btn" style={styles.actionBtn}><Ionicons name="swap-vertical" size={18} color={Colors.textPrimary} /></TouchableOpacity>
          <TouchableOpacity testID="filter-btn" style={styles.actionBtn}><Ionicons name="filter" size={18} color={Colors.textPrimary} /></TouchableOpacity>
        </View>
      </View>
      {loading ? <LoadingState /> : products.length === 0 ? <EmptyState icon="cube-outline" title="No products" message="No products found in this category" /> : (
        <FlatList data={products} numColumns={2} keyExtractor={i => i.id.toString()} contentContainerStyle={styles.grid}
          columnWrapperStyle={styles.gridRow}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} colors={[Colors.primary]} />}
          renderItem={({ item }) => <ProductCard product={item} onPress={() => router.push(`/product/${item.id}`)} />} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.base, paddingVertical: Spacing.md, gap: 12 },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.card, alignItems: 'center', justifyContent: 'center', ...Shadows.sm },
  headerInfo: { flex: 1 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary },
  headerCount: { fontSize: 12, color: Colors.textMuted },
  headerActions: { flexDirection: 'row', gap: 8 },
  actionBtn: { width: 36, height: 36, borderRadius: Radius.md, backgroundColor: Colors.card, alignItems: 'center', justifyContent: 'center', ...Shadows.sm },
  grid: { paddingHorizontal: 20, paddingBottom: 20 },
  gridRow: { justifyContent: 'space-between' as const, marginBottom: 12 },
});
