import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../src/constants/colors';
import { Product } from '../../src/models/types';
import { apiClient } from '../../src/services/api';
import ProductCard from '../../src/components/ProductCard';
import { EmptyState, LoadingState } from '../../src/components/States';

const popularSearches = ['Turmeric', 'Ashwagandha', 'Honey', 'Green Tea', 'Ghee', 'Triphala'];

export default function SearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (searchQuery?: string) => {
    const q = searchQuery || query;
    if (!q.trim()) return;
    setLoading(true);
    setSearched(true);
    const response = await apiClient.searchProducts(q.trim());
    if (response.success && response.data) {
      setResults(response.data);
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Search Input */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={Colors.textDisabled} />
          <TextInput
            testID="search-input"
            style={styles.input}
            placeholder="Search products..."
            placeholderTextColor={Colors.textDisabled}
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={() => handleSearch()}
            returnKeyType="search"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => { setQuery(''); setResults([]); setSearched(false); }}>
              <Ionicons name="close-circle" size={18} color={Colors.textDisabled} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {!searched && !loading && (
        <View style={styles.suggestionsContainer}>
          <Text style={styles.suggestionsTitle}>Popular Searches</Text>
          <View style={styles.chips}>
            {popularSearches.map((term) => (
              <TouchableOpacity
                key={term}
                testID={`popular-search-${term.toLowerCase()}`}
                style={styles.chip}
                onPress={() => { setQuery(term); handleSearch(term); }}
              >
                <Text style={styles.chipText}>{term}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {loading && <LoadingState />}

      {searched && !loading && results.length === 0 && (
        <EmptyState icon="search-outline" title="No results found" message={`We couldn't find products matching "${query}"`} />
      )}

      {results.length > 0 && (
        <FlatList
          data={results}
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
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: Colors.textPrimary,
  },
  suggestionsContainer: {
    paddingHorizontal: 16,
    marginTop: 8,
  },
  suggestionsTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
  },
  chipText: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '500',
  },
  grid: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
});
