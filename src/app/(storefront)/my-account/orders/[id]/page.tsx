import { notFound, redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { OrderSummaryCard } from "@/components/orders/OrderSummaryCard";
import { OrderItemsList } from "@/components/orders/OrderItemsList";
import { ShippingInfoCard } from "@/components/orders/ShippingInfoCard";
import Link from "next/link";

interface OrderDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailsPage(props: OrderDetailsPageProps) {
  const params = await props.params;
  const { id } = params;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth");
  }

  const { data: order, error } = await supabase
    .from("orders")
    .select(`
      *,
      order_items (
        *,
          variant:product_variants (
            id,
            color_id,
            size_id,
            color:colors(name),
            size:sizes(name)
          ),
          product:products (
            name,
            product_images (
              image_url,
              is_thumbnail,
              color_id,
              color:colors(name)
            )
          )
      )
    `)
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error || !order) {
    console.error("Order fetch error:", error);
    notFound();
  }

  // Handle old records safely
  const contactInfo = typeof order.contact_info === 'string' ? JSON.parse(order.contact_info) : order.contact_info;
  const shippingAddress = typeof order.shipping_address === 'string' ? JSON.parse(order.shipping_address) : order.shipping_address;

  const formattedItems = (order.order_items || []).map((item: any) => {
    const variantData = Array.isArray(item.variant) ? item.variant[0] : item.variant;
    const productData = Array.isArray(item.product) ? item.product[0] : item.product;
    
    return {
      ...item,
      variant: variantData ? {
        ...variantData,
        color: variantData.color?.name || null,
        size: variantData.size?.name || null,
      } : null,
      product: productData ? {
        ...productData,
        product_images: (productData.product_images || []).map((img: any) => ({
          ...img,
          color: img.color?.name || null,
        })),
      } : null,
    };
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4 border-b border-surface-container pb-4">
        <Link 
          href="/my-account" 
          className="text-secondary hover:text-primary transition-colors flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-container-low"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </Link>
        <h1 className="font-headline-lg text-headline-lg text-primary">
          Order Details
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-surface p-6 md:p-8 rounded-DEFAULT border border-surface-container">
            <OrderItemsList items={formattedItems} />
          </div>
          
          <ShippingInfoCard 
            contactInfo={contactInfo}
            shippingAddress={shippingAddress}
          />
        </div>
        
        <div className="lg:col-span-4 relative">
          <div className="md:sticky top-32">
            <OrderSummaryCard order={order} />
          </div>
        </div>
      </div>
    </div>
  );
}
