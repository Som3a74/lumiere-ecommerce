import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { ProductCard } from "@/components/shared/ProductCard";

export default async function MyAccountPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(3);

  const { data: wishlistData } = await supabase
    .from("wishlist_items")
    .select(`
      product_id,
      products (
        id,
        name,
        price,
        product_images (
          image_url
        )
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(2);

  const wishlistProducts = (wishlistData || []).map((item: any) => ({
    id: item.products.id,
    title: item.products.name,
    price: `$${item.products.price.toLocaleString()}`,
    imageUrl: item.products.product_images?.[0]?.image_url || "/assets/images/logo.png",
  }));

  return (
    <>
      {/* Order History Table */}
      <section>
        <h2 className="font-headline-md text-headline-md text-primary mb-8 border-b border-surface-container pb-4">
          Recent Orders
        </h2>

        {orders && orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b-2 border-primary font-label-caps text-label-caps text-secondary uppercase tracking-widest">
                  <th className="py-4 px-2 font-normal">Order ID</th>
                  <th className="py-4 px-2 font-normal">Date</th>
                  <th className="py-4 px-2 font-normal">Status</th>
                  <th className="py-4 px-2 font-normal text-right">Total</th>
                  <th className="py-4 px-2 font-normal text-right"></th>
                </tr>
              </thead>
              <tbody className="font-body-md text-body-md divide-y divide-surface-container">
                {orders.map((order) => (
                  <tr key={order.id} className="group hover:bg-surface-container-low transition-colors">
                    <td className="py-6 px-2 font-headline-md text-[16px] text-primary">#{order.id.split('-')[0].toUpperCase()}</td>
                    <td className="py-6 px-2 text-secondary">{new Date(order.created_at).toLocaleDateString()}</td>
                    <td className="py-6 px-2">
                      <span className={`inline-flex items-center px-3 py-1 text-[12px] tracking-widest uppercase ${order.status === 'Delivered' ? 'bg-primary text-on-primary' : 'bg-surface-container border border-outline-variant'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-6 px-2 text-right text-primary">${Number(order.total_amount).toLocaleString()}</td>
                    <td className="py-6 px-2 text-right">
                      <Link 
                        href={`/my-account/orders/${order.id}`}
                        className="font-label-caps text-label-caps text-secondary hover:text-primary underline underline-offset-4 transition-colors"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 bg-surface-container-low">
            <p className="font-body-md text-secondary mb-4">You have no recent orders.</p>
            <Link href="/collections" className="font-label-caps text-label-caps text-primary underline underline-offset-4">
              Explore Collections
            </Link>
          </div>
        )}
      </section>

      {/* Recent Wishlist Preview */}

    </>
  );
}
