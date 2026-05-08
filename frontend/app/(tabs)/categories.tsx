import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing } from '../../src/constants/colors';
import { Category } from '../../src/models/types';
import { apiClient } from '../../src/services/api';
import CategoryCard from '../../src/components/CategoryCard';
import { LoadingState, ErrorState } from '../../src/components/States';

export default function CategoriesScreen() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { load(); }, []);
  const load = async () => {
    setLoading(true);
    const r = await apiClient.getCategories();
    if (r.success && r.data) setCategories(r.data);
    else setError(r.error?.message || 'Failed');
    setLoading(false);
  };

  if (loading) return <SafeAreaView style={styles.container} edges={['top']}><LoadingState /></SafeAreaView>;
  if (error) return <SafeAreaView style={styles.container} edges={['top']}><ErrorState message={error} /></SafeAreaView>;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}><Text style={styles.title}>Categories</Text><Text style={styles.sub}>Browse all product categories</Text></View>
      <FlatList data={categories} numColumns={2} keyExtractor={(i) => i.id.toString()} contentContainerStyle={styles.grid}
        renderItem={({ item }) => <CategoryCard category={item} variant="grid" onPress={() => router.push(`/category/${item.slug}`)} />} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: Spacing.base, paddingVertical: Spacing.base },
  title: { fontSize: 26, fontWeight: '800', color: Colors.textPrimary },
  sub: { fontSize: 13, color: Colors.textMuted, marginTop: 4 },
  grid: { paddingHorizontal: 10, paddingBottom: 20 },
});
