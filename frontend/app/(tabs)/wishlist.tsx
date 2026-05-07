import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../src/constants/colors';
import { Config } from '../../src/constants/config';
import { useWishlistStore } from '../../src/stores/useWishlistStore';
import { useCartStore } from '../../src/stores/useCartStore';
import { EmptyState } from '../../src/components/States';

export default function WishlistScreen() {
  const router = useRouter();
  const { items, removeFromWishlist } = useWishlistStore();
  const addToCart = useCartStore(s => s.addToCart);

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.title}>Wishlist</Text>
        </View>
        <EmptyState icon="heart-outline" title="Wishlist is empty" message="Save your favourite products here for easy access later" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Wishlist</Text>
        <Text style={styles.count}>{items.length} items</Text>
      </View>
      <FlatList
        data={items}
        keyExtractor={(item) => item.product_id.toString()}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <TouchableOpacity style={styles.cardContent} onPress={() => router.push(`/product/${item.product_id}`)}>
              <Image source={{ uri: item.product.images[0]?.src }} style={styles.image} />
              <View style={styles.info}>
                <Text style={styles.name} numberOfLines={2}>{item.product.name}</Text>
                <View style={styles.priceRow}>
                  <Text style={styles.price}>{Config.CURRENCY_SYMBOL}{item.product.price}</Text>
                  {item.product.sale_price !== item.product.regular_price && (
                    <Text style={styles.oldPrice}>{Config.CURRENCY_SYMBOL}{item.product.regular_price}</Text>
                  )}
                </View>
                <Text style={styles.stock}>{item.product.stock_status === 'instock' ? 'In Stock' : 'Out of Stock'}</Text>
              </View>
            </TouchableOpacity>
            <View style={styles.actions}>
              <TouchableOpacity testID={`move-to-cart-${item.product_id}`} style={styles.cartBtn} onPress={() => { addToCart(item.product); removeFromWishlist(item.product_id); }}>
                <Ionicons name="bag-add-outline" size={16} color={Colors.textInverse} />
                <Text style={styles.cartBtnText}>Move to Cart</Text>
              </TouchableOpacity>
              <TouchableOpacity testID={`remove-wishlist-${item.product_id}`} style={styles.removeBtn} onPress={() => removeFromWishlist(item.product_id)}>
                <Ionicons name="trash-outline" size={16} color={Colors.error} />
              </TouchableOpacity>
            </View>
          </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  count: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    gap: 12,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  cardContent: {
    flexDirection: 'row',
    padding: 12,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: Colors.sectionAlt,
  },
  info: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  price: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.primary,
  },
  oldPrice: {
    fontSize: 12,
    color: Colors.textDisabled,
    textDecorationLine: 'line-through',
  },
  stock: {
    fontSize: 11,
    color: Colors.success,
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    padding: 10,
    gap: 8,
  },
  cartBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 8,
    gap: 6,
  },
  cartBtnText: {
    color: Colors.textInverse,
    fontSize: 12,
    fontWeight: '600',
  },
  removeBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: Colors.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
