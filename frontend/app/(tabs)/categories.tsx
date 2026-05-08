import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../src/constants/colors';
import { Category } from '../../src/models/types';
import { apiClient } from '../../src/services/api';
import CategoryCard from '../../src/components/CategoryCard';
import { LoadingState, ErrorState } from '../../src/components/States';

export default function CategoriesScreen() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    setError('');
    const response = await apiClient.getCategories();
    if (response.success && response.data) {
      setCategories(response.data);
    } else {
      setError(response.error?.message || 'Failed to load categories');
    }
    setLoading(false);
  };

  if (loading) return <SafeAreaView style={styles.container} edges={['top']}><LoadingState /></SafeAreaView>;
  if (error) return <SafeAreaView style={styles.container} edges={['top']}><ErrorState message={error} /></SafeAreaView>;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Categories</Text>
        <Text style={styles.subtitle}>Browse all product categories</Text>
      </View>
      <FlatList
        data={categories}
        numColumns={2}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.grid}
        renderItem={({ item }) => (
          <CategoryCard
            category={item}
            variant="grid"
            onPress={() => router.push(`/category/${item.slug}`)}
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  grid: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
});
