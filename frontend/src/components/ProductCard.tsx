import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Shadows, Spacing } from '../constants/colors';
import { Config } from '../constants/config';
import { Product } from '../models/types';
import { useCartStore } from '../stores/useCartStore';
import { useWishlistStore } from '../stores/useWishlistStore';
import { useToastStore } from '../stores/useToastStore';

const { width: SCREEN_W } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_W - 40 - 12) / 2; // 20px padding each side + 12px gap

interface ProductCardProps {
  product: Product;
  onPress: () => void;
  variant?: 'grid' | 'horizontal';
}

export default function ProductCard({ product, onPress, variant = 'grid' }: ProductCardProps) {
  const addToCart = useCartStore(s => s.addToCart);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();
  const showToast = useToastStore(s => s.show);
  const handleAdd = () => { addToCart(product); showToast('Added to cart'); };
  const inWishlist = isInWishlist(product.id);
  const hasPrice = product.price !== '' && product.price !== '0';
  const hasDiscount = hasPrice && product.sale_price && product.sale_price !== '' && product.sale_price !== product.regular_price;
  const imgSrc = product.images?.[0]?.src;
  const hasImage = imgSrc && imgSrc !== '';
  const rating = parseFloat(product.average_rating || '0');

  if (variant === 'horizontal') {
    return (
      <TouchableOpacity testID={`product-card-${product.id}`} style={styles.hCard} onPress={onPress} activeOpacity={0.7}>
        <View style={styles.hImageWrap}>
          {hasImage ? <Image source={{ uri: imgSrc }} style={styles.hImage} resizeMode="cover" /> : (
            <View style={styles.hPlaceholder}><Ionicons name="leaf-outline" size={28} color={Colors.textDisabled} /></View>
          )}
        </View>
        <View style={styles.hInfo}>
          {rating > 0 && (
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={12} color={Colors.warning} />
              <Text style={styles.ratingText}>{product.average_rating}</Text>
            </View>
          )}
          <Text style={styles.hName} numberOfLines={2}>{product.name}</Text>
          {hasPrice ? (
            <Text style={styles.hPrice}>{Config.CURRENCY_SYMBOL}{product.price}</Text>
          ) : <Text style={styles.noPrice}>Price on request</Text>}
        </View>
        {hasPrice && (
          <TouchableOpacity testID={`add-to-cart-btn-${product.id}`} style={styles.addBtnOrange} onPress={handleAdd}>
            <Ionicons name="add" size={20} color={Colors.textInverse} />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity testID={`product-card-${product.id}`} style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.imageContainer}>
        {hasImage ? <Image source={{ uri: imgSrc }} style={styles.image} resizeMode="cover" /> : (
          <View style={styles.placeholderImage}><Ionicons name="leaf-outline" size={32} color={Colors.textDisabled} /></View>
        )}
        {hasDiscount && (
          <View style={styles.saleBadge}>
            <Text style={styles.saleBadgeText}>
              {Math.round(((parseFloat(product.regular_price) - parseFloat(product.sale_price)) / parseFloat(product.regular_price)) * 100)}% OFF
            </Text>
          </View>
        )}
        <TouchableOpacity testID={`wishlist-btn-${product.id}`} style={styles.wishlistBtn}
          onPress={() => inWishlist ? removeFromWishlist(product.id) : addToWishlist(product)}>
          <Ionicons name={inWishlist ? 'heart' : 'heart-outline'} size={16} color={inWishlist ? Colors.error : Colors.textMuted} />
        </TouchableOpacity>
      </View>
      <View style={styles.info}>
        {rating > 0 && (
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={11} color={Colors.warning} />
            <Text style={styles.ratingText}>{product.average_rating}</Text>
            <Text style={styles.reviewCount}>({product.rating_count})</Text>
          </View>
        )}
        <Text style={styles.name} numberOfLines={2} ellipsizeMode="tail">{product.name}</Text>
        <View style={styles.priceRow}>
          <View style={styles.priceGroup}>
            {hasPrice ? (
              <>
                <Text style={styles.price} numberOfLines={1}>{Config.CURRENCY_SYMBOL}{product.price}</Text>
                {hasDiscount && <Text style={styles.oldPrice} numberOfLines={1}>{Config.CURRENCY_SYMBOL}{product.regular_price}</Text>}
              </>
            ) : <Text style={styles.noPrice}>Price on request</Text>}
          </View>
          {hasPrice && (
            <TouchableOpacity testID={`add-to-cart-btn-${product.id}`} style={styles.addBtnOrange} onPress={handleAdd}>
              <Ionicons name="add" size={16} color={Colors.textInverse} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: Colors.card, borderRadius: Radius.xl, overflow: 'hidden', width: CARD_WIDTH, ...Shadows.md },
  imageContainer: { position: 'relative', aspectRatio: 1, backgroundColor: Colors.surface },
  image: { width: '100%', height: '100%' },
  placeholderImage: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.surface },
  saleBadge: { position: 'absolute', top: 8, left: 8, backgroundColor: Colors.discount, paddingHorizontal: 7, paddingVertical: 3, borderRadius: Radius.sm },
  saleBadgeText: { color: Colors.textInverse, fontSize: 9, fontWeight: '700' },
  wishlistBtn: { position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: Radius.circle, width: 26, height: 26, alignItems: 'center', justifyContent: 'center' },
  info: { paddingHorizontal: 10, paddingTop: 8, paddingBottom: 10 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginBottom: 3 },
  ratingText: { fontSize: 10, fontWeight: '600', color: Colors.textPrimary },
  reviewCount: { fontSize: 9, color: Colors.textMuted },
  name: { fontSize: 12, fontWeight: '600', color: Colors.textPrimary, lineHeight: 16, marginBottom: 6, height: 32 },
  priceRow: { flexDirection: 'row', alignItems: 'center' },
  priceGroup: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  price: { fontSize: 14, fontWeight: '800', color: Colors.primaryDark },
  oldPrice: { fontSize: 10, color: Colors.textDisabled, textDecorationLine: 'line-through', marginLeft: 4 },
  noPrice: { fontSize: 10, color: Colors.textMuted, fontStyle: 'italic' },
  addBtnOrange: { backgroundColor: Colors.accent, borderRadius: Radius.circle, width: 28, height: 28, alignItems: 'center', justifyContent: 'center', marginLeft: 4 },
  // Horizontal variant
  hCard: { backgroundColor: Colors.card, borderRadius: Radius.xl, padding: Spacing.md, flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.md, ...Shadows.sm },
  hImageWrap: { width: 70, height: 70, borderRadius: Radius.lg, overflow: 'hidden', backgroundColor: Colors.surface },
  hImage: { width: '100%', height: '100%' },
  hPlaceholder: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' },
  hInfo: { flex: 1, marginLeft: Spacing.md },
  hName: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary, marginBottom: 4 },
  hPrice: { fontSize: 16, fontWeight: '800', color: Colors.primaryDark },
});
