import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { Config } from '../constants/config';
import { Product } from '../models/types';
import { useCartStore } from '../stores/useCartStore';
import { useWishlistStore } from '../stores/useWishlistStore';

interface ProductCardProps {
  product: Product;
  onPress: () => void;
}

export default function ProductCard({ product, onPress }: ProductCardProps) {
  const addToCart = useCartStore(s => s.addToCart);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();
  const inWishlist = isInWishlist(product.id);

  const hasPrice = product.price !== '' && product.price !== '0';
  const hasDiscount = hasPrice && product.sale_price && product.sale_price !== '' && product.sale_price !== product.regular_price;
  const imgSrc = product.images?.[0]?.src;
  const hasImage = imgSrc && imgSrc !== '';

  return (
    <TouchableOpacity testID={`product-card-${product.id}`} style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.imageContainer}>
        {hasImage ? (
          <Image source={{ uri: imgSrc }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={styles.placeholderImage}>
            <Ionicons name="image-outline" size={32} color={Colors.textDisabled} />
          </View>
        )}
        {hasDiscount && (
          <View style={styles.saleBadge}>
            <Text style={styles.saleBadgeText}>SALE</Text>
          </View>
        )}
        <TouchableOpacity
          testID={`wishlist-btn-${product.id}`}
          style={styles.wishlistBtn}
          onPress={() => inWishlist ? removeFromWishlist(product.id) : addToWishlist(product)}
        >
          <Ionicons name={inWishlist ? 'heart' : 'heart-outline'} size={18} color={inWishlist ? Colors.accent : Colors.textSecondary} />
        </TouchableOpacity>
      </View>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>{product.name}</Text>
        <View style={styles.priceRow}>
          {hasPrice ? (
            <>
              <Text style={styles.price}>{Config.CURRENCY_SYMBOL}{product.price}</Text>
              {hasDiscount && (
                <Text style={styles.regularPrice}>{Config.CURRENCY_SYMBOL}{product.regular_price}</Text>
              )}
            </>
          ) : (
            <Text style={styles.noPriceText}>Price on request</Text>
          )}
        </View>
        {parseFloat(product.average_rating) > 0 && (
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={12} color={Colors.warning} />
            <Text style={styles.rating}>{product.average_rating}</Text>
            <Text style={styles.ratingCount}>({product.rating_count})</Text>
          </View>
        )}
        {hasPrice && (
          <TouchableOpacity
            testID={`add-to-cart-btn-${product.id}`}
            style={styles.addBtn}
            onPress={() => addToCart(product)}
          >
            <Ionicons name="add" size={18} color={Colors.textInverse} />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.borderLight,
    flex: 1,
    margin: 6,
  },
  imageContainer: {
    position: 'relative',
    aspectRatio: 1,
    backgroundColor: Colors.sectionAlt,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.sectionAlt,
  },
  saleBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: Colors.accent,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  saleBadgeText: {
    color: Colors.textInverse,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  wishlistBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 14,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    padding: 10,
    position: 'relative',
  },
  name: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
    lineHeight: 18,
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
  regularPrice: {
    fontSize: 12,
    color: Colors.textDisabled,
    textDecorationLine: 'line-through',
  },
  noPriceText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 4,
  },
  rating: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  ratingCount: {
    fontSize: 11,
    color: Colors.textDisabled,
  },
  addBtn: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: Colors.primary,
    borderRadius: 14,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
