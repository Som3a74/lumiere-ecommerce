import { getAdminOrders } from "@/app/actions/admin-orders";
import Link from "next/link";
import OrderStatusSelect from "./OrderStatusSelect";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const { data: orders, success } = await getAdminOrders();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-headline-md font-headline-md text-primary">Order Management</h1>
      </div>

      <div className="bg-surface-container-lowest border border-surface-container-high rounded-none overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-surface-container-high bg-surface-container-low text-xs uppercase tracking-wider text-secondary">
                <th className="p-4 font-medium">Order ID</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Customer</th>
                <th className="p-4 font-medium">Total</th>
                <th className="p-4 font-medium">Payment</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-high text-sm text-primary">
              {!success || orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-secondary">
                    No orders found.
                  </td>
                </tr>
              ) : (
                orders.map((order: any) => {
                  const contact = order.contact_info || {};
                  const customerName = `${contact.firstName || ""} ${contact.lastName || ""}`.trim() || "Unknown";
                  const payment = order.payments?.[0]; // Get most recent payment record
                  
                  return (
                    <tr key={order.id} className="hover:bg-surface-container-lowest/50 transition-colors">
                      <td className="p-4 font-mono text-xs text-secondary">
                        {order.id.split("-")[0]}...
                      </td>
                      <td className="p-4">
                        {new Date(order.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                      </td>
                      <td className="p-4">
                        <div className="font-medium">{customerName}</div>
                        <div className="text-xs text-secondary">{contact.email}</div>
                      </td>
                      <td className="p-4 font-medium">
                        ${Number(order.total_amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2 py-1 text-[10px] uppercase tracking-wider font-medium ${
                          payment?.status === "succeeded" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {payment?.status || "Pending"}
                        </span>
                      </td>
                      <td className="p-4">
                        <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
                      </td>
                      <td className="p-4 text-right">
                        <Button variant="outline" size="sm" className="rounded-none text-xs h-8" asChild>
                          <Link href={`/admin/orders/${order.id}`}>View Details</Link>
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
