import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import CheckoutClient from "./CheckoutClient";

export default async function CheckoutPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Extract user profile data
  const userProfile = {
    firstName: user?.user_metadata?.first_name || "",
    lastName: user?.user_metadata?.last_name || "",
    email: user?.email || "",
    phone: user?.user_metadata?.phone || "",
  };

  // Fetch cart items
  const { data: cartItems, error } = await supabase
    .from("cart_items")
    .select(`
      id,
      quantity,
      variant_id,
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

  const items = cartItems || [];

  // Calculate Totals
  const subtotal = items.reduce((sum, item) => {
    // Note: product structure depending on foreign key setup might be an array if not a single relation,
    // but typically it's an object if it's a many-to-one relation.
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

  return <CheckoutClient userProfile={userProfile} cartItems={items} totals={totals} />;
}
