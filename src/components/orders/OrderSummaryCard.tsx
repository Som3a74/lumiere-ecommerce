interface OrderSummaryCardProps {
  order: {
    id: string;
    created_at: string;
    status: string;
    total_amount: number;
    shipping_cost?: number; // assuming free if not provided
  };
}

export function OrderSummaryCard({ order }: OrderSummaryCardProps) {
  const taxRate = 0.08;
  const shipping = order.shipping_cost || 0;
  
  // Backwards calculation for display purposes, since we only store total
  // Usually, these would be stored separately in the DB.
  const subtotal = order.total_amount / (1 + taxRate);
  const tax = order.total_amount - subtotal;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="bg-surface-container-low p-6 md:p-8 rounded-DEFAULT h-full border border-surface-container">
      <h2 className="font-headline-md text-headline-md text-primary mb-6 border-b border-surface-container pb-4">
        Order Summary
      </h2>
      
      <div className="space-y-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="font-body-md text-secondary">Order ID</span>
          <span className="font-headline-sm text-primary">
            #{order.id.split("-")[0].toUpperCase()}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-body-md text-secondary">Date Placed</span>
          <span className="font-body-md text-primary">
            {formatDate(order.created_at)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-body-md text-secondary">Status</span>
          <span className={`inline-flex items-center px-3 py-1 text-[12px] tracking-widest uppercase ${order.status === 'Delivered' ? 'bg-primary text-on-primary' : 'bg-surface-container border border-outline-variant text-primary'}`}>
            {order.status}
          </span>
        </div>
      </div>

      <div className="space-y-4 pt-6 border-t border-surface-container">
        <div className="flex justify-between font-body-md text-secondary">
          <span>Subtotal</span>
          <span>${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        <div className="flex justify-between font-body-md text-secondary">
          <span>Shipping</span>
          <span>{shipping === 0 ? "Complimentary" : `$${shipping.toFixed(2)}`}</span>
        </div>
        <div className="flex justify-between font-body-md text-secondary">
          <span>Estimated Tax (8%)</span>
          <span>${tax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        <div className="flex justify-between font-headline-md text-primary pt-4 border-t border-surface-container">
          <span>Total</span>
          <span>${Number(order.total_amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
      </div>
    </div>
  );
}
