interface ShippingInfoCardProps {
  contactInfo: {
    email: string;
    phone: string;
    firstName: string;
    lastName: string;
  };
  shippingAddress: {
    address: string;
    city: string;
    country: string;
    postalCode: string;
  };
}

export function ShippingInfoCard({ contactInfo, shippingAddress }: ShippingInfoCardProps) {
  if (!contactInfo && !shippingAddress) {
    return null; // Handle older orders without JSON data gracefully
  }

  return (
    <div className="bg-surface p-6 md:p-8 rounded-DEFAULT border border-surface-container mt-8">
      <h2 className="font-headline-md text-headline-md text-primary mb-6 border-b border-surface-container pb-4">
        Shipping Information
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="font-label-caps text-label-caps text-secondary uppercase tracking-widest mb-4">
            Contact
          </h3>
          <div className="space-y-1 font-body-md text-primary">
            <p>{contactInfo?.firstName} {contactInfo?.lastName}</p>
            <p>{contactInfo?.email}</p>
            <p>{contactInfo?.phone}</p>
          </div>
        </div>
        
        <div>
          <h3 className="font-label-caps text-label-caps text-secondary uppercase tracking-widest mb-4">
            Address
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-[11px] font-bold text-tertiary-fixed-dim uppercase tracking-widest mb-1">Street Address</p>
              <p className="text-primary font-body-md">{shippingAddress?.address || "N/A"}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[11px] font-bold text-tertiary-fixed-dim uppercase tracking-widest mb-1">City</p>
                <p className="text-primary font-body-md">{shippingAddress?.city || "N/A"}</p>
              </div>
              <div>
                <p className="text-[11px] font-bold text-tertiary-fixed-dim uppercase tracking-widest mb-1">Postal Code</p>
                <p className="text-primary font-body-md">{shippingAddress?.postalCode || "N/A"}</p>
              </div>
            </div>
            <div>
              <p className="text-[11px] font-bold text-tertiary-fixed-dim uppercase tracking-widest mb-1">Country</p>
              <p className="text-primary font-body-md uppercase">{shippingAddress?.country || "N/A"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
