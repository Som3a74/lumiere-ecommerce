import Link from "next/link";

interface OrderItem {
  id: string;
  product_id: string;
  quantity: number;
  price_at_time: number;
  product: {
    name: string;
    product_images: { image_url: string; is_thumbnail: boolean; color?: string }[];
  };
  variant?: {
    color?: string;
    size?: string;
  };
}

interface OrderItemsListProps {
  items: OrderItem[];
}

export function OrderItemsList({ items }: OrderItemsListProps) {
  return (
    <div className="space-y-6">
      <h2 className="font-headline-md text-headline-md text-primary mb-6 border-b border-surface-container pb-4">
        Items Ordered
      </h2>
      
      <div className="space-y-8">
        {items.map((item) => {
          const product = Array.isArray(item.product) ? item.product[0] : item.product;
          if (!product) return null; // Defensive check
          
          // Find thumbnail based on ordered variant color
          const variantColor = item.variant?.color;
          const matchingImages = product.product_images?.filter((img: { image_url: string; is_thumbnail: boolean; color?: string }) => !variantColor || img.color === variantColor);
          
          const thumbnail = matchingImages?.find((img: { image_url: string; is_thumbnail: boolean; color?: string }) => img.is_thumbnail)?.image_url 
            || matchingImages?.[0]?.image_url
            || product.product_images?.[0]?.image_url 
            || "/placeholder-image.jpg";

          return (
            <div key={item.id} className="flex flex-col sm:flex-row gap-6 pb-8 border-b border-surface-container last:border-0 last:pb-0">
              <div className="w-full sm:w-32 h-32 bg-surface-dim overflow-hidden flex-shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 ease-out"
                  src={thumbnail}
                />
              </div>
              
              <div className="flex flex-col justify-between flex-grow">
                <div>
                  <Link href={`/product/${item.product_id}`} className="hover:opacity-80 transition-opacity">
                    <h3 className="font-headline-md text-[18px] text-primary line-clamp-2">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="font-body-md text-secondary mt-2">Qty: {item.quantity}</p>
                  {item.variant && (
                    <p className="font-body-sm text-secondary mt-1">
                      {item.variant.color && <span>Color: {item.variant.color}</span>}
                      {item.variant.color && item.variant.size && <span> | </span>}
                      {item.variant.size && <span>Size: {item.variant.size}</span>}
                    </p>
                  )}
                </div>
                
                <div className="flex justify-between items-end mt-4 sm:mt-0">
                  <div className="font-body-lg text-primary">
                    ${(item.price_at_time * item.quantity).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div className="font-body-sm text-secondary">
                    ${item.price_at_time.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} each
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
