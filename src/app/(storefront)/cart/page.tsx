import { createClient } from "@/utils/supabase/server";
import CartClient from "./CartClient";

export default async function CartPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // If not logged in, we'll just show an empty cart for now
  // A robust implementation might check local storage, but since we rely on DB:
  if (!user) {
    return <CartClient cartItems={[]} totals={{ subtotal: 0, tax: 0, total: 0 }} />;
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
        color,
        size
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
    return {
      ...item,
      color: variantData?.color || null,
      size: variantData?.size || null,
    };
  });

  // Calculate Totals
  const subtotal = items.reduce((sum, item) => {
    const productData = Array.isArray(item.product) ? item.product[0] : item.product;
    const price = productData?.price || 0;
    return sum + (price * item.quantity);
  }, 0);

  const taxRate = 0.08;
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  const totals = {
    subtotal,
    tax,
    total,
  };

  return <CartClient cartItems={items} totals={totals} />;
}
