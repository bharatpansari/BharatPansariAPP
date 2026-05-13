import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Shadows, Spacing } from '../../src/constants/colors';
import { Config } from '../../src/constants/config';
import { Product } from '../../src/models/types';
import { apiClient } from '../../src/services/api';
import { useCartStore } from '../../src/stores/useCartStore';
import { useWishlistStore } from '../../src/stores/useWishlistStore';
import { useToastStore } from '../../src/stores/useToastStore';
import { LoadingState } from '../../src/components/States';

const { width: SW } = Dimensions.get('window');

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [imgIdx, setImgIdx] = useState(0);
  const addToCart = useCartStore(s => s.addToCart);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();
  const showToast = useToastStore(s => s.show);
  const { bottom: bottomInset } = useSafeAreaInsets();
  const barPaddingBottom = Math.max(bottomInset, 12);

  useEffect(() => { load(); }, [id]);
  const load = async () => { if (!id) return; const r = await apiClient.getProduct(parseInt(id)); if (r.success && r.data) setProduct(r.data); setLoading(false); };

  if (loading) return <LoadingState />;
  if (!product) return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.navBar}><TouchableOpacity testID="back-btn" style={styles.navBtn} onPress={() => router.back()}><Ionicons name="arrow-back" size={22} color={Colors.textPrimary} /></TouchableOpacity><View /></View>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 }}>
        <Ionicons name="alert-circle-outline" size={48} color={Colors.textDisabled} />
        <Text style={{ fontSize: 16, fontWeight: '600', color: Colors.textPrimary, marginTop: 12 }}>Product not found</Text>
      </View>
    </SafeAreaView>
  );

  const inWL = isInWishlist(product.id);
  const hasPrice = product.price !== '' && product.price !== '0';
  const hasDis = hasPrice && product.sale_price !== '' && product.sale_price !== product.regular_price;
  const disc = hasDis ? Math.round(((parseFloat(product.regular_price) - parseFloat(product.sale_price)) / parseFloat(product.regular_price)) * 100) : 0;
  const imgs = product.images.filter(i => i.src && i.src !== '');
  const rating = parseFloat(product.average_rating || '0');

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.navBar}>
          <TouchableOpacity testID="back-btn" style={styles.navBtn} onPress={() => router.back()}><Ionicons name="arrow-back" size={22} color={Colors.textPrimary} /></TouchableOpacity>
          <TouchableOpacity testID="share-btn" style={styles.navBtn}><Ionicons name="share-outline" size={22} color={Colors.textPrimary} /></TouchableOpacity>
        </View>
        {/* Image Gallery */}
        <View style={styles.gallery}>
          {imgs.length > 0 ? (
            <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} onScroll={e => setImgIdx(Math.round(e.nativeEvent.contentOffset.x / SW))} scrollEventThrottle={16}>
              {imgs.map(img => <Image key={img.id} source={{ uri: img.src }} style={styles.prodImg} resizeMode="cover" />)}
            </ScrollView>
          ) : <View style={[styles.prodImg, { alignItems: 'center', justifyContent: 'center' }]}><Ionicons name="image-outline" size={64} color={Colors.textDisabled} /></View>}
          {imgs.length > 1 && <View style={styles.dots}>{imgs.map((_, i) => <View key={i} style={[styles.dot, i === imgIdx && styles.dotActive]} />)}</View>}
        </View>
        {/* Info */}
        <View style={styles.infoSection}>
          {rating > 0 && (
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={14} color={Colors.primary} /><Text style={styles.ratingVal}>{product.average_rating}</Text>
              <Text style={styles.reviewCnt}>({product.rating_count} REVIEWS)</Text>
            </View>
          )}
          <Text style={styles.prodName}>{product.name}</Text>
          <View style={styles.priceRow}>
            {hasPrice ? (
              <>
                <Text style={styles.price}>{Config.CURRENCY_SYMBOL}{product.price}</Text>
                {hasDis && <Text style={styles.oldPrice}>{Config.CURRENCY_SYMBOL}{product.regular_price}</Text>}
                {hasDis && <View style={styles.discBadge}><Text style={styles.discText}>{disc}% OFF</Text></View>}
              </>
            ) : <Text style={styles.noPriceText}>Price not available</Text>}
          </View>
          {/* Stock */}
          <View style={styles.stockRow}>
            <View style={[styles.stockDot, { backgroundColor: product.stock_status === 'instock' ? Colors.success : Colors.error }]} />
            <Text style={styles.stockText}>{product.stock_status === 'instock' ? 'In Stock' : 'Out of Stock'}</Text>
          </View>
        </View>
        {/* Description */}
        {product.short_description ? <View style={styles.descSection}><Text style={styles.descText}>{product.short_description}</Text></View> : null}
        {product.description ? (
          <View style={styles.descSection}><Text style={styles.sectionLabel}>Description</Text><Text style={styles.descText}>{product.description}</Text></View>
        ) : null}
        {/* Qty */}
        <View style={styles.qtySection}>
          <Text style={styles.sectionLabel}>Quantity</Text>
          <View style={styles.qtyRow}>
            <TouchableOpacity testID="qty-decrease" style={styles.qtyBtn} onPress={() => setQty(Math.max(1, qty - 1))}><Ionicons name="remove" size={16} color={Colors.textPrimary} /></TouchableOpacity>
            <Text style={styles.qtyVal}>{qty}</Text>
            <TouchableOpacity testID="qty-increase" style={styles.qtyBtn} onPress={() => setQty(qty + 1)}><Ionicons name="add" size={16} color={Colors.textPrimary} /></TouchableOpacity>
          </View>
        </View>
        {/* Attributes */}
        {product.attributes.length > 0 && (
          <View style={styles.attrSection}>
            {product.attributes.map((a, i) => (
              <View key={i} style={styles.attrRow}><Text style={styles.attrName}>{a.name}</Text><Text style={styles.attrVal}>{a.options.join(', ')}</Text></View>
            ))}
          </View>
        )}
        {/* Disclaimer */}
        <View style={styles.disclaimerBox}>
          <Ionicons name="information-circle-outline" size={16} color={Colors.textMuted} />
          <Text style={styles.disclaimerText}>Information is for general wellness and educational purposes only. It is not medical advice.</Text>
        </View>
        <View style={{ height: 76 + barPaddingBottom + 24 }} />
      </ScrollView>
      {/* Bottom Bar */}
      <View style={[styles.bottomBar, { paddingBottom: barPaddingBottom }]}>
        <TouchableOpacity testID="wishlist-detail-btn" style={[styles.wlBtn, inWL && styles.wlActive]}
          onPress={() => inWL ? removeFromWishlist(product.id) : addToWishlist(product)}>
          <Ionicons name={inWL ? 'heart' : 'heart-outline'} size={22} color={inWL ? Colors.error : Colors.textMuted} />
        </TouchableOpacity>
        {hasPrice ? (
          <TouchableOpacity testID="add-to-cart-detail-btn" style={styles.addCartBtn} onPress={() => { addToCart(product, qty); showToast('Added to cart'); }}>
            <Ionicons name="bag-add" size={20} color={Colors.textInverse} /><Text style={styles.addCartText}>Add to Cart</Text>
          </TouchableOpacity>
        ) : <View style={[styles.addCartBtn, { backgroundColor: Colors.textDisabled }]}><Text style={styles.addCartText}>Price Not Available</Text></View>}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  navBar: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: Spacing.base, paddingVertical: 8 },
  navBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.card, alignItems: 'center', justifyContent: 'center', ...Shadows.sm },
  gallery: { backgroundColor: Colors.surface },
  prodImg: { width: SW, height: SW * 0.8 },
  dots: { flexDirection: 'row', justifyContent: 'center', paddingVertical: 10, gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.border },
  dotActive: { backgroundColor: Colors.primary, width: 20 },
  infoSection: { padding: Spacing.base },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 8 },
  ratingVal: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
  reviewCnt: { fontSize: 11, color: Colors.textMuted, letterSpacing: 0.5 },
  prodName: { fontSize: 24, fontWeight: '800', color: Colors.textPrimary, lineHeight: 30, marginBottom: 10 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  price: { fontSize: 26, fontWeight: '800', color: Colors.primaryDark },
  oldPrice: { fontSize: 16, color: Colors.textDisabled, textDecorationLine: 'line-through' },
  discBadge: { backgroundColor: Colors.discountBg, paddingHorizontal: 8, paddingVertical: 3, borderRadius: Radius.sm },
  discText: { color: Colors.discount, fontSize: 11, fontWeight: '700' },
  noPriceText: { fontSize: 16, color: Colors.textMuted },
  stockRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  stockDot: { width: 8, height: 8, borderRadius: 4 },
  stockText: { fontSize: 13, fontWeight: '500', color: Colors.textSecondary },
  descSection: { paddingHorizontal: Spacing.base, paddingVertical: Spacing.md, borderTopWidth: 1, borderTopColor: Colors.borderLight },
  sectionLabel: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary, marginBottom: 8 },
  descText: { fontSize: 14, color: Colors.textSecondary, lineHeight: 22 },
  qtySection: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.base, paddingVertical: Spacing.md, borderTopWidth: 1, borderTopColor: Colors.borderLight },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 16, backgroundColor: Colors.surface, borderRadius: Radius.pill, paddingHorizontal: 4, paddingVertical: 2 },
  qtyBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center' },
  qtyVal: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary, minWidth: 20, textAlign: 'center' },
  attrSection: { paddingHorizontal: Spacing.base, paddingBottom: Spacing.md },
  attrRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  attrName: { fontSize: 13, color: Colors.textMuted },
  attrVal: { fontSize: 13, fontWeight: '500', color: Colors.textPrimary },
  disclaimerBox: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginHorizontal: Spacing.base, padding: Spacing.md, backgroundColor: Colors.primarySurface, borderRadius: Radius.lg },
  disclaimerText: { flex: 1, fontSize: 11, color: Colors.textMuted, lineHeight: 16 },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', paddingHorizontal: Spacing.base, paddingTop: Spacing.base, backgroundColor: Colors.card, borderTopWidth: 1, borderTopColor: Colors.borderLight, gap: 12 },
  wlBtn: { width: 52, height: 52, borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center' },
  wlActive: { borderColor: Colors.errorLight, backgroundColor: Colors.errorLight },
  addCartBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.primaryDark, borderRadius: Radius.pill, gap: 8, height: 52 },
  addCartText: { fontSize: 16, fontWeight: '700', color: Colors.textInverse },
});
