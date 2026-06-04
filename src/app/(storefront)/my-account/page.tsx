import Link from "next/link";
import { createClient } from "@/utils/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export default async function MyAccountPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  // Fetch Orders
  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  // Generate dynamic notifications from recent orders
  type NotificationType = {
    id: string;
    title: string;
    message: string;
    date: string;
    type: 'info' | 'success' | 'warning';
  };

  const notifications: NotificationType[] = [];
  if (orders) {
    const sortedOrders = [...orders].sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());

    // Take the 3 most recently updated orders
    const recentUpdates = sortedOrders.slice(0, 3);

    recentUpdates.forEach(order => {
      const orderIdShort = order.id.split('-')[0].toUpperCase();
      const createdDateStr = new Date(order.created_at).toLocaleDateString();
      const updatedDateStr = new Date(order.updated_at).toLocaleDateString();
      const prevStatus = order.contact_info?.previous_status ? order.contact_info.previous_status.toUpperCase() : 'PENDING';
      const statusLower = order.status ? order.status.toLowerCase() : '';

      // Show only one notification reflecting the current status
      if (statusLower === 'pending' || statusLower === 'processing') {
        notifications.push({
          id: `notif-${order.id}-processing`,
          title: 'Order Processing',
          message: `Your order #${orderIdShort} is now PROCESSING instead of ${prevStatus}.`,
          date: updatedDateStr,
          type: 'info'
        });
      } else if (statusLower === 'shipped') {
        notifications.push({
          id: `notif-${order.id}-shipped`,
          title: 'Order Shipped',
          message: `Good news! Your order #${orderIdShort} is now SHIPPED instead of ${prevStatus}.`,
          date: updatedDateStr,
          type: 'success'
        });
      } else if (statusLower === 'delivered') {
        notifications.push({
          id: `notif-${order.id}-delivered`,
          title: 'Order Delivered',
          message: `Your order #${orderIdShort} has been updated to DELIVERED instead of ${prevStatus}. Enjoy your purchase!`,
          date: updatedDateStr,
          type: 'success'
        });
      } else if (statusLower === 'cancelled') {
        notifications.push({
          id: `notif-${order.id}-cancelled`,
          title: 'Order Cancelled',
          message: `Your order #${orderIdShort} has been CANCELLED instead of ${prevStatus}.`,
          date: updatedDateStr,
          type: 'warning'
        });
      }
    });
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

      {/* Left Column: Notifications & Wishlist */}
      <div className="lg:col-span-4 flex flex-col gap-12">
        {/* Notifications Panel */}
        <section className="bg-surface-container-low border border-surface-container p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-headline-sm text-primary flex items-center gap-2">
              <span className="material-symbols-outlined !text-[20px]">notifications</span>
              Recent Updates
            </h2>
          </div>

          <div className="flex flex-col gap-4">
            {notifications.length > 0 ? (
              notifications.map(notif => (
                <div key={notif.id} className="p-4 border-l-2 border-primary bg-background">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-label-caps text-label-caps uppercase tracking-widest text-primary">{notif.title}</h3>
                    <span className="text-[10px] text-secondary">{notif.date}</span>
                  </div>
                  <p className="font-body-sm text-secondary">{notif.message}</p>
                </div>
              ))
            ) : (
              <p className="font-body-sm text-secondary">You have no recent notifications.</p>
            )}
          </div>
        </section>


      </div>

      {/* Right Column: Order History */}
      <div className="lg:col-span-8">
        <section>
          <div className="flex items-center justify-between mb-8 border-b border-surface-container pb-4">
            <h2 className="font-headline-md text-primary">
              Order History
            </h2>
            <Link href="/collections" className="font-label-caps text-[12px] uppercase tracking-widest bg-primary text-on-primary px-4 py-2 hover:bg-surface-tint transition-colors">
              Shop Now
            </Link>
          </div>

          {orders && orders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="border-b border-surface-container font-label-caps text-[10px] text-secondary uppercase tracking-widest">
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
                      <td className="py-6 px-2 font-headline-sm text-[14px] text-primary">#{order.id.split('-')[0].toUpperCase()}</td>
                      <td className="py-6 px-2 text-secondary text-[14px]">{new Date(order.created_at).toLocaleDateString()}</td>
                      <td className="py-6 px-2">
                        <span className={`inline-flex items-center px-2 py-1 text-[10px] tracking-widest uppercase ${order.status.toLowerCase() === 'delivered' ? 'bg-primary text-on-primary' :
                            order.status.toLowerCase() === 'shipped' ? 'bg-surface-tint text-on-primary' :
                              order.status.toLowerCase() === 'cancelled' ? 'bg-error text-on-error' :
                                'bg-surface-container text-secondary border border-outline-variant'
                          }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-6 px-2 text-right text-primary text-[14px]">${Number(order.total_amount).toLocaleString()}</td>
                      <td className="py-6 px-2 text-right">
                        <Link
                          href={`/my-account/orders/${order.id}`}
                          className="font-label-caps text-[10px] text-secondary hover:text-primary underline underline-offset-4 transition-colors uppercase tracking-widest"
                        >
                          Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-24 bg-surface-container-low border border-surface-container">
              <span className="material-symbols-outlined text-[32px] text-secondary mb-4">inventory_2</span>
              <p className="font-body-md text-secondary mb-6">You haven't placed any orders yet.</p>
            </div>
          )}
        </section>
      </div>

    </div>
  );
}
