import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Shadows, Spacing } from '../../src/constants/colors';
import { Config } from '../../src/constants/config';
import { useCartStore } from '../../src/stores/useCartStore';
import { EmptyState } from '../../src/components/States';

export default function CartScreen() {
  const { items, updateQuantity, removeFromCart, getTotal, clearCart } = useCartStore();
  const total = getTotal();
  const router = useRouter();
  const { bottom } = useSafeAreaInsets();
  const goBack = () => { if (router.canGoBack()) router.back(); else router.replace('/(tabs)'); };

  const Header = ({ showClear }: { showClear: boolean }) => (
    <View style={styles.header}>
      <TouchableOpacity testID="cart-back-btn" style={styles.backBtn} onPress={goBack}>
        <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
      </TouchableOpacity>
      <Text style={styles.title}>Cart</Text>
      {showClear ? (
        <TouchableOpacity testID="clear-cart-btn" onPress={clearCart}><Text style={styles.clearText}>Clear All</Text></TouchableOpacity>
      ) : <View style={styles.backBtn} />}
    </View>
  );

  if (items.length === 0) return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header showClear={false} />
      <EmptyState icon="bag-outline" title="Your cart is empty" message="Add products to your cart to see them here" />
    </SafeAreaView>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header showClear={true} />
      <FlatList data={items} keyExtractor={i => i.product_id.toString()} contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const img = item.product.images?.[0]?.src;
          return (
            <View style={styles.card}>
              {img ? <Image source={{ uri: img }} style={styles.image} resizeMode="cover" /> : <View style={[styles.image, styles.ph]}><Ionicons name="leaf-outline" size={20} color={Colors.textDisabled} /></View>}
              <View style={styles.info}>
                <Text style={styles.name} numberOfLines={2}>{item.product.name}</Text>
                <Text style={styles.price}>{Config.CURRENCY_SYMBOL}{item.product.price}</Text>
                <View style={styles.qtyRow}>
                  <TouchableOpacity testID={`qty-minus-${item.product_id}`} style={styles.qtyBtn} onPress={() => updateQuantity(item.product_id, item.quantity - 1)}>
                    <Ionicons name="remove" size={14} color={Colors.textPrimary} />
                  </TouchableOpacity>
                  <Text style={styles.qtyText}>{item.quantity}</Text>
                  <TouchableOpacity testID={`qty-plus-${item.product_id}`} style={styles.qtyBtn} onPress={() => updateQuantity(item.product_id, item.quantity + 1)}>
                    <Ionicons name="add" size={14} color={Colors.textPrimary} />
                  </TouchableOpacity>
                </View>
              </View>
              <TouchableOpacity testID={`remove-cart-${item.product_id}`} onPress={() => removeFromCart(item.product_id)}>
                <Ionicons name="close" size={18} color={Colors.textDisabled} />
              </TouchableOpacity>
            </View>
          );
        }}
        ListFooterComponent={() => (
          <>
            {/* Offers */}
            <View style={styles.offersCard}>
              <View style={styles.offersHeader}><Ionicons name="pricetag" size={18} color={Colors.primary} /><Text style={styles.offersTitle}>Offers & Benefits</Text></View>
              <View style={styles.couponRow}>
                <View style={styles.couponInput}><Text style={styles.couponPlaceholder}>Enter coupon code</Text></View>
                <TouchableOpacity testID="apply-coupon-btn" style={styles.couponBtn}><Text style={styles.couponBtnText}>APPLY</Text></TouchableOpacity>
              </View>
            </View>
            {/* Summary */}
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Price Summary</Text>
              <View style={styles.divider} />
              <View style={styles.row}><Text style={styles.rowLabel}>Subtotal</Text><Text style={styles.rowValue}>{Config.CURRENCY_SYMBOL}{total.toFixed(0)}</Text></View>
              <View style={styles.row}><Text style={styles.rowLabel}>Shipping</Text><Text style={styles.rowFree}>Free</Text></View>
              <View style={styles.divider} />
              <View style={styles.row}><Text style={styles.totalLabel}>Total Amount</Text><Text style={styles.totalValue}>{Config.CURRENCY_SYMBOL}{total.toFixed(0)}</Text></View>
            </View>
          </>
        )}
      />
      {/* Bottom bar */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(bottom, 12) + 8 }]}>
        <View><Text style={styles.btLabel}>Total</Text><Text style={styles.btTotal}>{Config.CURRENCY_SYMBOL}{total.toFixed(0)}</Text></View>
        <TouchableOpacity testID="checkout-btn" style={styles.checkoutBtn}>
          <Text style={styles.checkoutText}>Proceed to Checkout</Text>
          <Ionicons name="arrow-forward" size={18} color={Colors.textInverse} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.base, paddingVertical: Spacing.md, gap: 12 },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.card, alignItems: 'center', justifyContent: 'center', ...Shadows.sm },
  title: { flex: 1, textAlign: 'center', fontSize: 20, fontWeight: '800', color: Colors.textPrimary },
  clearText: { fontSize: 13, color: Colors.error, fontWeight: '600' },
  list: { paddingHorizontal: Spacing.base, gap: 12, paddingBottom: 12 },
  card: { flexDirection: 'row', backgroundColor: Colors.card, borderRadius: Radius.xl, padding: Spacing.md, ...Shadows.sm },
  image: { width: 72, height: 72, borderRadius: Radius.lg, backgroundColor: Colors.surface },
  ph: { alignItems: 'center', justifyContent: 'center' },
  info: { flex: 1, marginLeft: Spacing.md, justifyContent: 'center' },
  name: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary, marginBottom: 2 },
  price: { fontSize: 16, fontWeight: '800', color: Colors.textPrimary, marginBottom: 8 },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: Colors.surface, borderRadius: Radius.pill, alignSelf: 'flex-start', paddingHorizontal: 4, paddingVertical: 2 },
  qtyBtn: { width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center' },
  qtyText: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary, minWidth: 16, textAlign: 'center' },
  offersCard: { backgroundColor: Colors.card, borderRadius: Radius.xl, padding: Spacing.base, marginTop: Spacing.base, ...Shadows.sm },
  offersHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: Spacing.md },
  offersTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  couponRow: { flexDirection: 'row', gap: 8 },
  couponInput: { flex: 1, backgroundColor: Colors.surface, borderRadius: Radius.md, paddingHorizontal: Spacing.md, paddingVertical: 10 },
  couponPlaceholder: { fontSize: 13, color: Colors.textDisabled },
  couponBtn: { backgroundColor: Colors.primary, borderRadius: Radius.md, paddingHorizontal: 18, justifyContent: 'center' },
  couponBtnText: { color: Colors.textInverse, fontSize: 13, fontWeight: '700' },
  summaryCard: { backgroundColor: Colors.card, borderRadius: Radius.xl, padding: Spacing.base, marginTop: Spacing.md, ...Shadows.sm },
  summaryTitle: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary, marginBottom: 8 },
  divider: { height: 1, backgroundColor: Colors.borderLight, marginVertical: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  rowLabel: { fontSize: 14, color: Colors.textSecondary },
  rowValue: { fontSize: 14, fontWeight: '500', color: Colors.textPrimary },
  rowFree: { fontSize: 14, fontWeight: '600', color: Colors.primary },
  totalLabel: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  totalValue: { fontSize: 18, fontWeight: '800', color: Colors.primary },
  bottomBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: Colors.card, paddingHorizontal: Spacing.base, paddingTop: Spacing.md, borderTopWidth: 1, borderTopColor: Colors.borderLight },
  btLabel: { fontSize: 12, color: Colors.textMuted },
  btTotal: { fontSize: 20, fontWeight: '800', color: Colors.textPrimary },
  checkoutBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.primary, borderRadius: Radius.pill, paddingHorizontal: 24, paddingVertical: 14, gap: 8 },
  checkoutText: { fontSize: 15, fontWeight: '700', color: Colors.textInverse },
});
