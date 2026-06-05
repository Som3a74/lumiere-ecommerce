import { getAdminOrderDetails } from "@/app/actions/admin-orders";
import OrderStatusSelect from "../OrderStatusSelect";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function AdminOrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data: order, success, error } = await getAdminOrderDetails(id);

  if (!success || !order) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center text-red-500 bg-red-50">
        Order not found or an error occurred. {error}
      </div>
    );
  }

  const contact = order.contact_info || {};
  const shipping = order.shipping_address || {};
  const payment = order.payments?.[0];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <Button variant="ghost" size="sm" asChild className="rounded-none">
              <Link href="/admin/orders">
                <span className="material-symbols-outlined text-[18px] mr-2">arrow_back</span>
                Back to Orders
              </Link>
            </Button>
          </div>
          <h1 className="text-headline-md font-headline-md text-primary">
            Order #{order.id.split("-")[0]}
          </h1>
          <p className="text-secondary text-sm">
            Placed on {new Date(order.created_at).toLocaleString(undefined, { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
          </p>
        </div>

        <div className="flex items-center gap-4 bg-surface-container-lowest p-4 border border-surface-container-high">
          <span className="text-sm font-medium text-secondary uppercase tracking-wider">Update Status:</span>
          <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Items */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-surface-container-lowest border border-surface-container-high p-6 rounded-none">
            <h2 className="text-headline-sm font-headline-sm text-primary mb-6 border-b border-surface-container pb-4">
              Order Items
            </h2>
            
            <div className="space-y-6">
              {order.order_items?.map((item: any) => {
                const imageUrl = item.product?.product_images?.[0]?.image_url || "/placeholder-image.jpg";
                const color = item.variant?.color?.name;
                const size = item.variant?.size?.name;

                return (
                  <div key={item.id} className="flex gap-4 border-b border-surface-container-high pb-6 last:border-0 last:pb-0">
                    <div className="w-20 h-20 bg-surface-dim flex-shrink-0 relative">
                      <Image src={imageUrl} alt={item.product?.name} fill sizes="80px" className="object-cover" />
                    </div>
                    <div className="flex-grow flex flex-col justify-between">
                      <div>
                        <h3 className="font-medium text-primary line-clamp-1">{item.product?.name}</h3>
                        <div className="text-sm text-secondary mt-1">
                          {color && <span>Color: {color} | </span>}
                          {size && <span>Size: {size}</span>}
                        </div>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-sm text-secondary">Qty: {item.quantity}</span>
                        <span className="font-medium text-primary">
                          ${(item.price_at_time * item.quantity).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-8 pt-6 border-t border-surface-container flex justify-between items-center">
              <span className="text-secondary font-medium uppercase tracking-wider text-sm">Total Paid</span>
              <span className="text-headline-sm font-headline-sm text-primary">
                ${Number(order.total_amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Details */}
        <div className="space-y-8">
          {/* Customer Card */}
          <div className="bg-surface-container-lowest border border-surface-container-high p-6 rounded-none">
            <h2 className="text-sm font-bold text-primary uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">person</span>
              Customer
            </h2>
            <div className="space-y-3 text-sm text-secondary">
              <p className="font-medium text-primary text-base">
                {contact.firstName} {contact.lastName}
              </p>
              <p className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">mail</span>
                {contact.email}
              </p>
              <p className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">call</span>
                {contact.phone}
              </p>
            </div>
          </div>

          {/* Shipping Card */}
          <div className="bg-surface-container-lowest border border-surface-container-high p-6 rounded-none">
            <h2 className="text-sm font-bold text-primary uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">local_shipping</span>
              Shipping Address
            </h2>
            <div className="space-y-4 mt-2">
              <div>
                <p className="text-[11px] font-bold text-tertiary-fixed-dim uppercase tracking-widest mb-1">Street Address</p>
                <p className="text-primary text-sm">{shipping.address || "N/A"}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[11px] font-bold text-tertiary-fixed-dim uppercase tracking-widest mb-1">City</p>
                  <p className="text-primary text-sm">{shipping.city || "N/A"}</p>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-tertiary-fixed-dim uppercase tracking-widest mb-1">Postal Code</p>
                  <p className="text-primary text-sm">{shipping.postalCode || "N/A"}</p>
                </div>
              </div>
              <div>
                <p className="text-[11px] font-bold text-tertiary-fixed-dim uppercase tracking-widest mb-1">Country</p>
                <p className="text-primary text-sm uppercase">{shipping.country || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Payment Card */}
          <div className="bg-surface-container-lowest border border-surface-container-high p-6 rounded-none">
            <h2 className="text-sm font-bold text-primary uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">payment</span>
              Payment details
            </h2>
            {payment ? (
              <div className="space-y-3 text-sm text-secondary">
                <p className="flex items-center justify-between">
                  <span>Status</span>
                  <span className={`px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold ${
                    payment.status === "succeeded" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                  }`}>
                    {payment.status}
                  </span>
                </p>
                <p className="flex items-center justify-between">
                  <span>Method</span>
                  <span className="uppercase">{payment.details?.method || "Card"}</span>
                </p>
                <div className="pt-3 mt-3 border-t border-surface-container-high">
                  <p className="text-xs text-tertiary-fixed-dim break-all">
                    Provider ID: {payment.provider}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-secondary">No payment records found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
