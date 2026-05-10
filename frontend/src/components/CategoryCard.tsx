import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Shadows, Spacing } from '../constants/colors';
import { Category } from '../models/types';

const CATEGORY_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  'herbs': 'leaf-outline',
  'spices': 'flame-outline',
  'oils': 'water-outline',
  'pooja': 'hand-left-outline',
  'ayurvedic': 'fitness-outline',
  'default': 'grid-outline',
};

function getCategoryIcon(slug: string): keyof typeof Ionicons.glyphMap {
  for (const key of Object.keys(CATEGORY_ICONS)) {
    if (slug.toLowerCase().includes(key)) return CATEGORY_ICONS[key];
  }
  return CATEGORY_ICONS.default;
}

interface CategoryCardProps {
  category: Category;
  onPress: () => void;
  variant?: 'grid' | 'chip' | 'circle';
}

export default function CategoryCard({ category, onPress, variant = 'grid' }: CategoryCardProps) {
  const hasImage = category.image && category.image !== '';

  if (variant === 'circle') {
    return (
      <TouchableOpacity testID={`category-chip-${category.slug}`} style={styles.circleItem} onPress={onPress} activeOpacity={0.7}>
        <View style={styles.circleIcon}>
          {hasImage ? (
            <Image source={{ uri: category.image }} style={styles.circleImage} resizeMode="cover" />
          ) : (
            <Ionicons name={getCategoryIcon(category.slug)} size={24} color={Colors.primaryDark} />
          )}
        </View>
        <Text style={styles.circleLabel} numberOfLines={1}>{category.name}</Text>
      </TouchableOpacity>
    );
  }

  if (variant === 'chip') {
    return (
      <TouchableOpacity testID={`category-chip-${category.slug}`} style={styles.chip} onPress={onPress} activeOpacity={0.7}>
        {hasImage ? <Image source={{ uri: category.image }} style={styles.chipImage} resizeMode="cover" /> : (
          <View style={[styles.chipImage, styles.chipPlaceholder]}><Ionicons name={getCategoryIcon(category.slug)} size={14} color={Colors.primary} /></View>
        )}
        <Text style={styles.chipText} numberOfLines={1}>{category.name}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity testID={`category-card-${category.slug}`} style={styles.gridCard} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.gridImageContainer}>
        {hasImage ? <Image source={{ uri: category.image }} style={styles.gridImage} resizeMode="cover" /> : (
          <Ionicons name={getCategoryIcon(category.slug)} size={28} color={Colors.primaryDark} />
        )}
      </View>
      <Text style={styles.gridName} numberOfLines={2}>{category.name}</Text>
      <Text style={styles.gridCount}>{category.count} products</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  circleItem: { alignItems: 'center', width: 76, marginRight: 14 },
  circleIcon: { width: 54, height: 54, borderRadius: 27, backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', marginBottom: 6 },
  circleImage: { width: '100%', height: '100%' },
  circleLabel: { fontSize: 10, fontWeight: '500', color: Colors.textSecondary, textAlign: 'center', width: '100%' },
  chip: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.card, borderRadius: Radius.pill, paddingVertical: 8, paddingHorizontal: 14, marginRight: 10, ...Shadows.sm },
  chipImage: { width: 24, height: 24, borderRadius: 12, marginRight: 8 },
  chipPlaceholder: { backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center' },
  chipText: { fontSize: 13, fontWeight: '500', color: Colors.textPrimary },
  gridCard: { backgroundColor: Colors.card, borderRadius: Radius.xl, padding: Spacing.base, alignItems: 'center', flex: 1, margin: 6, ...Shadows.sm },
  gridImageContainer: { width: 64, height: 64, borderRadius: 32, backgroundColor: Colors.primaryLight, overflow: 'hidden', marginBottom: 8, alignItems: 'center', justifyContent: 'center' },
  gridImage: { width: '100%', height: '100%' },
  gridName: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary, textAlign: 'center', marginBottom: 2 },
  gridCount: { fontSize: 10, color: Colors.textMuted },
});
