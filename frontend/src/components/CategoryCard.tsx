import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { Category } from '../models/types';

interface CategoryCardProps {
  category: Category;
  onPress: () => void;
  variant?: 'grid' | 'chip';
}

export default function CategoryCard({ category, onPress, variant = 'grid' }: CategoryCardProps) {
  const hasImage = category.image && category.image !== '';

  if (variant === 'chip') {
    return (
      <TouchableOpacity testID={`category-chip-${category.slug}`} style={styles.chip} onPress={onPress} activeOpacity={0.7}>
        {hasImage ? (
          <Image source={{ uri: category.image }} style={styles.chipImage} resizeMode="cover" />
        ) : (
          <View style={[styles.chipImage, styles.chipPlaceholder]}>
            <Ionicons name="grid-outline" size={14} color={Colors.textDisabled} />
          </View>
        )}
        <Text style={styles.chipText} numberOfLines={1}>{category.name}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity testID={`category-card-${category.slug}`} style={styles.gridCard} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.gridImageContainer}>
        {hasImage ? (
          <Image source={{ uri: category.image }} style={styles.gridImage} resizeMode="cover" />
        ) : (
          <View style={styles.gridPlaceholder}>
            <Ionicons name="grid-outline" size={24} color={Colors.textDisabled} />
          </View>
        )}
      </View>
      <Text style={styles.gridName} numberOfLines={2}>{category.name}</Text>
      <Text style={styles.gridCount}>{category.count} products</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginRight: 10,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  chipImage: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  chipPlaceholder: {
    backgroundColor: Colors.sectionAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.textPrimary,
  },
  gridCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    flex: 1,
    margin: 6,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  gridImageContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.sectionAlt,
    overflow: 'hidden',
    marginBottom: 8,
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  gridPlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridName: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 2,
  },
  gridCount: {
    fontSize: 10,
    color: Colors.textSecondary,
  },
});
