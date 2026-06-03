import { createClient } from "@/utils/supabase/server";
import CartClient from "./CartClient";
import { getAppliedCoupon } from "@/app/actions/coupons";

export default async function CartPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // If not logged in, we'll just show an empty cart for now
  if (!user) {
    return <CartClient cartItems={[]} totals={{ subtotal: 0, tax: 0, total: 0, discount: 0 }} coupon={null} />;
  }

  // Fetch cart items
  const { data: cartItems, error } = await supabase
    .from("cart_items")
    .select(`
      id,
      quantity,
      variant_id,
      variant:product_variants (
        id,
        color_id,
        size_id,
        color:colors(name),
        size:sizes(name)
      ),
      product:products (
        id,
        name,
        price,
        product_images (
          image_url,
          display_order
        )
      )
    `)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error fetching cart items:", error);
  }

  const items = (cartItems || []).map(item => {
    const variantData = Array.isArray(item.variant) ? item.variant[0] : item.variant;
    
    const extractName = (data: any) => {
      if (!data) return null;
      if (Array.isArray(data)) return data[0]?.name || null;
      return data.name || null;
    };

    return {
      ...item,
      color: extractName(variantData?.color),
      size: extractName(variantData?.size),
    };
  });

  // Check for coupon
  const coupon = await getAppliedCoupon();

  // Calculate Totals
  const subtotal = items.reduce((sum, item) => {
    const productData = Array.isArray(item.product) ? item.product[0] : item.product;
    const price = productData?.price || 0;
    return sum + (price * item.quantity);
  }, 0);

  let discount = 0;
  if (coupon) {
    discount = subtotal * (coupon.discount_percentage / 100);
  }

  const subtotalAfterDiscount = subtotal - discount;
  const taxRate = 0.08;
  const tax = subtotalAfterDiscount * taxRate;
  const total = subtotalAfterDiscount + tax;

  const totals = {
    subtotal,
    discount,
    tax,
    total,
  };

  return <CartClient cartItems={items} totals={totals} coupon={coupon} />;
}
