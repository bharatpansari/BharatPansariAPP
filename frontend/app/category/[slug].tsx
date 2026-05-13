import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Shadows, Spacing } from '../../src/constants/colors';
import { Product } from '../../src/models/types';
import { apiClient } from '../../src/services/api';
import ProductCard from '../../src/components/ProductCard';
import { LoadingState, EmptyState } from '../../src/components/States';
import { useToastStore } from '../../src/stores/useToastStore';

type SortKey = 'newest' | 'price_low' | 'price_high' | 'popular' | 'rating';
const SORTS: { key: SortKey; label: string; orderby: string; order: 'asc' | 'desc' }[] = [
  { key: 'newest', label: 'Newest', orderby: 'date', order: 'desc' },
  { key: 'price_low', label: 'Price Low', orderby: 'price', order: 'asc' },
  { key: 'price_high', label: 'Price High', orderby: 'price', order: 'desc' },
  { key: 'popular', label: 'Popular', orderby: 'popularity', order: 'desc' },
  { key: 'rating', label: 'Rating', orderby: 'rating', order: 'desc' },
];

export default function CategoryProductsScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [selectedSort, setSelectedSort] = useState<SortKey>('newest');
  const showToast = useToastStore(s => s.show);

  useEffect(() => { load(selectedSort); }, [slug]);
  const fetchProducts = async (sortKey: SortKey) => {
    if (!slug) return null;
    const opt = SORTS.find(s => s.key === sortKey)!;
    return apiClient.getProducts(slug, { orderby: opt.orderby, order: opt.order });
  };
  const load = async (sortKey: SortKey) => {
    if (!slug) return;
    setCategoryName(typeof slug === 'string' ? slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : 'Products');
    setLoading(true);
    const r = await fetchProducts(sortKey);
    if (r && r.success && r.data) setProducts(r.data);
    setLoading(false);
  };
  const onRefresh = async () => {
    setRefreshing(true);
    const r = await fetchProducts(selectedSort);
    if (r && r.success && r.data) setProducts(r.data);
    setRefreshing(false);
  };
  const handleSort = async (key: SortKey) => {
    if (key === selectedSort) return;
    setSelectedSort(key);
    setLoading(true);
    const r = await fetchProducts(key);
    if (r && r.success && r.data) setProducts(r.data);
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity testID="category-back-btn" style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>{categoryName || 'Products'}</Text>
          <Text style={styles.headerCount}>{loading ? 'Loading…' : products.length === 0 ? 'No products yet' : `${products.length} ${products.length === 1 ? 'product' : 'products'}`}</Text>
        </View>
      </View>
      {!loading && products.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
          {SORTS.map(s => {
            const active = selectedSort === s.key;
            return (
              <TouchableOpacity key={s.key} testID={`sort-chip-${s.key}`}
                style={[styles.chip, active && styles.chipActive]} onPress={() => handleSort(s.key)}>
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{s.label}</Text>
              </TouchableOpacity>
            );
          })}
          <TouchableOpacity testID="sort-chip-filter" style={[styles.chip, styles.chipFilter]}
            onPress={() => showToast('Filters coming soon')}>
            <Ionicons name="options-outline" size={14} color={Colors.textPrimary} />
            <Text style={styles.chipText}>Filter</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
      {loading ? <LoadingState /> : products.length === 0 ? <EmptyState icon="cube-outline" title="No products yet" message="This category is empty right now. Check back soon." /> : (
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
  headerTitle: { fontSize: 20, fontWeight: '800', color: Colors.textPrimary },
  headerCount: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  chipRow: { paddingLeft: 20, paddingRight: 12, paddingBottom: Spacing.md, alignItems: 'center' },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 6, height: 36, paddingHorizontal: 14, borderRadius: 20, backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.borderLight, marginRight: 8 },
  chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipFilter: { borderColor: Colors.border },
  chipText: { fontSize: 12.5, fontWeight: '600', color: Colors.textPrimary },
  chipTextActive: { color: Colors.textInverse },
  grid: { paddingHorizontal: 20, paddingBottom: 20 },
  gridRow: { justifyContent: 'space-between' as const, marginBottom: 12 },
});
