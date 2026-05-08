import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Shadows, Spacing } from '../../src/constants/colors';
import { Product } from '../../src/models/types';
import { apiClient } from '../../src/services/api';
import ProductCard from '../../src/components/ProductCard';
import { EmptyState, LoadingState } from '../../src/components/States';

const popular = ['Turmeric', 'Ashwagandha', 'Honey', 'Green Tea', 'Ghee', 'Guggal', 'Agarbatti'];

export default function SearchScreen() {
  const router = useRouter();
  const [q, setQ] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const search = async (term?: string) => {
    const s = term || q;
    if (!s.trim()) return;
    setLoading(true); setSearched(true);
    const r = await apiClient.searchProducts(s.trim());
    if (r.success && r.data) setResults(r.data);
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.searchWrap}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={Colors.textDisabled} />
          <TextInput testID="search-input" style={styles.input} placeholder="Search products..." placeholderTextColor={Colors.textDisabled}
            value={q} onChangeText={setQ} onSubmitEditing={() => search()} returnKeyType="search" />
          {q.length > 0 && <TouchableOpacity onPress={() => { setQ(''); setResults([]); setSearched(false); }}><Ionicons name="close-circle" size={18} color={Colors.textDisabled} /></TouchableOpacity>}
        </View>
      </View>
      {!searched && !loading && (
        <View style={styles.suggestions}>
          <Text style={styles.sugTitle}>Popular Searches</Text>
          <View style={styles.chips}>
            {popular.map(t => (
              <TouchableOpacity key={t} testID={`popular-search-${t.toLowerCase()}`} style={styles.chip} onPress={() => { setQ(t); search(t); }}>
                <Text style={styles.chipText}>{t}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
      {loading && <LoadingState />}
      {searched && !loading && results.length === 0 && <EmptyState icon="search-outline" title="No results found" message={`We couldn't find products matching "${q}"`} />}
      {results.length > 0 && (
        <FlatList data={results} numColumns={2} keyExtractor={i => i.id.toString()} contentContainerStyle={styles.grid}
          renderItem={({ item }) => <ProductCard product={item} onPress={() => router.push(`/product/${item.id}`)} />} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  searchWrap: { paddingHorizontal: Spacing.base, paddingVertical: Spacing.md },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.card, borderRadius: Radius.pill, paddingHorizontal: Spacing.base, paddingVertical: 10, gap: 10, ...Shadows.sm },
  input: { flex: 1, fontSize: 15, color: Colors.textPrimary },
  suggestions: { paddingHorizontal: Spacing.base, marginTop: 8 },
  sugTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary, marginBottom: 12 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { backgroundColor: Colors.primaryLight, paddingHorizontal: 16, paddingVertical: 8, borderRadius: Radius.pill },
  chipText: { fontSize: 13, color: Colors.primaryDark, fontWeight: '500' },
  grid: { paddingHorizontal: 10, paddingBottom: 20 },
});
