import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../src/constants/colors';
import { Config } from '../../src/constants/config';
import { Product } from '../../src/models/types';
import { apiClient } from '../../src/services/api';
import { useCartStore } from '../../src/stores/useCartStore';
import { useWishlistStore } from '../../src/stores/useWishlistStore';
import { LoadingState } from '../../src/components/States';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const addToCart = useCartStore(s => s.addToCart);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    if (!id) return;
    const response = await apiClient.getProduct(parseInt(id));
    if (response.success && response.data) {
      setProduct(response.data);
    }
    setLoading(false);
  };

  if (loading) return <LoadingState />;
  if (!product) return null;

  const inWishlist = isInWishlist(product.id);
  const hasDiscount = product.sale_price && product.sale_price !== product.regular_price;
  const discount = hasDiscount ? Math.round(((parseFloat(product.regular_price) - parseFloat(product.sale_price)) / parseFloat(product.regular_price)) * 100) : 0;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity testID="back-btn" style={styles.headerBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity testID="share-btn" style={styles.headerBtn}>
            <Ionicons name="share-outline" size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Image Gallery */}
        <View style={styles.imageGallery}>
          <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
            {product.images.map((img) => (
              <Image key={img.id} source={{ uri: img.src }} style={styles.productImage} />
            ))}
          </ScrollView>
          {hasDiscount && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{discount}% OFF</Text>
            </View>
          )}
        </View>

        {/* Product Info */}
        <View style={styles.infoSection}>
          <Text style={styles.productName}>{product.name}</Text>
          <View style={styles.priceRow}>
            <Text style={styles.price}>{Config.CURRENCY_SYMBOL}{product.price}</Text>
            {hasDiscount && (
              <Text style={styles.oldPrice}>{Config.CURRENCY_SYMBOL}{product.regular_price}</Text>
            )}
          </View>

          {/* Rating */}
          <View style={styles.ratingRow}>
            <View style={styles.stars}>
              {[1, 2, 3, 4, 5].map(s => (
                <Ionicons key={s} name={s <= Math.round(parseFloat(product.average_rating)) ? 'star' : 'star-outline'} size={16} color={Colors.warning} />
              ))}
            </View>
            <Text style={styles.ratingText}>{product.average_rating} ({product.rating_count} reviews)</Text>
          </View>

          {/* Stock */}
          <View style={styles.stockRow}>
            <View style={[styles.stockDot, { backgroundColor: product.stock_status === 'instock' ? Colors.success : Colors.error }]} />
            <Text style={styles.stockText}>{product.stock_status === 'instock' ? 'In Stock' : 'Out of Stock'}</Text>
          </View>

          {/* Short Description */}
          <Text style={styles.shortDesc}>{product.short_description}</Text>
        </View>

        {/* Quantity Selector */}
        <View style={styles.quantitySection}>
          <Text style={styles.sectionLabel}>Quantity</Text>
          <View style={styles.quantityRow}>
            <TouchableOpacity testID="qty-decrease" style={styles.qtyBtn} onPress={() => setQuantity(Math.max(1, quantity - 1))}>
              <Ionicons name="remove" size={18} color={Colors.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.qtyValue}>{quantity}</Text>
            <TouchableOpacity testID="qty-increase" style={styles.qtyBtn} onPress={() => setQuantity(quantity + 1)}>
              <Ionicons name="add" size={18} color={Colors.textPrimary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Description */}
        <View style={styles.descriptionSection}>
          <Text style={styles.sectionLabel}>Product Details</Text>
          <Text style={styles.descText}>{product.description}</Text>
        </View>

        {/* Attributes */}
        {product.attributes.length > 0 && (
          <View style={styles.attributesSection}>
            <Text style={styles.sectionLabel}>Specifications</Text>
            {product.attributes.map((attr, i) => (
              <View key={i} style={styles.attrRow}>
                <Text style={styles.attrName}>{attr.name}</Text>
                <Text style={styles.attrValue}>{attr.options.join(', ')}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Disclaimer */}
        <View style={styles.disclaimerSection}>
          <Ionicons name="information-circle-outline" size={16} color={Colors.textSecondary} />
          <Text style={styles.disclaimerText}>
            Information is for general wellness and educational purposes only. It is not medical advice. Please consult a qualified professional before use.
          </Text>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Fixed Bottom Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          testID="wishlist-detail-btn"
          style={[styles.wishlistBtn, inWishlist && styles.wishlistBtnActive]}
          onPress={() => inWishlist ? removeFromWishlist(product.id) : addToWishlist(product)}
        >
          <Ionicons name={inWishlist ? 'heart' : 'heart-outline'} size={22} color={inWishlist ? Colors.accent : Colors.textPrimary} />
        </TouchableOpacity>
        <TouchableOpacity
          testID="add-to-cart-detail-btn"
          style={styles.addToCartBtn}
          onPress={() => { addToCart(product, quantity); }}
        >
          <Ionicons name="bag-add" size={20} color={Colors.textInverse} />
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
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
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  imageGallery: {
    position: 'relative',
    backgroundColor: Colors.sectionAlt,
  },
  productImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 0.8,
    resizeMode: 'cover',
  },
  discountBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: Colors.accent,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  discountText: {
    color: Colors.textInverse,
    fontSize: 11,
    fontWeight: '700',
  },
  infoSection: {
    padding: 16,
  },
  productName: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  price: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.primary,
  },
  oldPrice: {
    fontSize: 16,
    color: Colors.textDisabled,
    textDecorationLine: 'line-through',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  stars: {
    flexDirection: 'row',
    gap: 2,
  },
  ratingText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  stockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  stockDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  stockText: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  shortDesc: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  quantitySection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  sectionLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  qtyBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: Colors.sectionAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyValue: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  descriptionSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  descText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  attributesSection: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  attrRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  attrName: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  attrValue: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.textPrimary,
  },
  disclaimerSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginHorizontal: 16,
    padding: 12,
    backgroundColor: Colors.sectionAlt,
    borderRadius: 10,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 11,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 16,
    paddingBottom: 24,
    backgroundColor: Colors.card,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    gap: 12,
  },
  wishlistBtn: {
    width: 52,
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wishlistBtnActive: {
    borderColor: Colors.accentLight,
    backgroundColor: Colors.accentLight,
  },
  addToCartBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 14,
    gap: 8,
  },
  addToCartText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textInverse,
  },
});
