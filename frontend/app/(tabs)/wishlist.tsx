import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Shadows, Spacing } from '../../src/constants/colors';
import { Config } from '../../src/constants/config';
import { useWishlistStore } from '../../src/stores/useWishlistStore';
import { useCartStore } from '../../src/stores/useCartStore';
import { EmptyState } from '../../src/components/States';

export default function WishlistScreen() {
  const router = useRouter();
  const { items, removeFromWishlist } = useWishlistStore();
  const addToCart = useCartStore(s => s.addToCart);

  if (items.length === 0) return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}><Text style={styles.title}>Wishlist</Text></View>
      <EmptyState icon="heart-outline" title="Wishlist is empty" message="Save your favourite products here for easy access later" />
    </SafeAreaView>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}><Text style={styles.title}>Wishlist</Text><Text style={styles.count}>{items.length} items</Text></View>
      <FlatList data={items} keyExtractor={i => i.product_id.toString()} contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const p = item.product; const img = p.images?.[0]?.src; const hasPrice = p.price !== '' && p.price !== '0';
          return (
            <View style={styles.card}>
              <TouchableOpacity style={styles.cardContent} onPress={() => router.push(`/product/${item.product_id}`)}>
                {img ? <Image source={{ uri: img }} style={styles.image} resizeMode="cover" /> : <View style={[styles.image, styles.ph]}><Ionicons name="leaf-outline" size={24} color={Colors.textDisabled} /></View>}
                <View style={styles.info}>
                  <Text style={styles.name} numberOfLines={2}>{p.name}</Text>
                  <View style={styles.priceRow}>
                    {hasPrice ? <Text style={styles.price}>{Config.CURRENCY_SYMBOL}{p.price}</Text> : <Text style={styles.noPrice}>Price on request</Text>}
                    {hasPrice && p.sale_price !== p.regular_price && <Text style={styles.oldPrice}>{Config.CURRENCY_SYMBOL}{p.regular_price}</Text>}
                  </View>
                </View>
              </TouchableOpacity>
              <View style={styles.actions}>
                <TouchableOpacity testID={`move-to-cart-${item.product_id}`} style={styles.cartBtn} onPress={() => { addToCart(p); removeFromWishlist(item.product_id); }}>
                  <Ionicons name="bag-add-outline" size={16} color={Colors.textInverse} /><Text style={styles.cartBtnText}>Move to Cart</Text>
                </TouchableOpacity>
                <TouchableOpacity testID={`remove-wishlist-${item.product_id}`} style={styles.removeBtn} onPress={() => removeFromWishlist(item.product_id)}>
                  <Ionicons name="trash-outline" size={16} color={Colors.error} />
                </TouchableOpacity>
              </View>
            </View>
          );
        }} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.base, paddingVertical: Spacing.base },
  title: { fontSize: 26, fontWeight: '800', color: Colors.textPrimary },
  count: { fontSize: 13, color: Colors.textMuted },
  list: { paddingHorizontal: Spacing.base, paddingBottom: 20, gap: 12 },
  card: { backgroundColor: Colors.card, borderRadius: Radius.xl, overflow: 'hidden', ...Shadows.sm },
  cardContent: { flexDirection: 'row', padding: Spacing.md },
  image: { width: 80, height: 80, borderRadius: Radius.lg, backgroundColor: Colors.surface },
  ph: { alignItems: 'center', justifyContent: 'center' },
  info: { flex: 1, marginLeft: Spacing.md, justifyContent: 'center' },
  name: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary, marginBottom: 4 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  price: { fontSize: 16, fontWeight: '800', color: Colors.primaryDark },
  oldPrice: { fontSize: 12, color: Colors.textDisabled, textDecorationLine: 'line-through' },
  noPrice: { fontSize: 12, color: Colors.textMuted, fontStyle: 'italic' },
  actions: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: Colors.borderLight, padding: 10, gap: 8 },
  cartBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.primary, borderRadius: Radius.md, paddingVertical: 8, gap: 6 },
  cartBtnText: { color: Colors.textInverse, fontSize: 12, fontWeight: '600' },
  removeBtn: { width: 36, height: 36, borderRadius: Radius.md, backgroundColor: Colors.errorLight, alignItems: 'center', justifyContent: 'center' },
});
