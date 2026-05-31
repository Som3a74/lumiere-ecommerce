import Link from "next/link"

export interface Product {
  id: string
  name: string
  price: number
  imageUrl?: string
}

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  // Format price
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(product.price)

  return (
    <Link href={`/product/${product.id}`} className="flex flex-col gap-6 group cursor-pointer">
      <div className="aspect-[3/4] bg-background relative w-full overflow-hidden">
        {/* Placeholder for the structural image */}
        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground font-sans text-xs tracking-widest uppercase bg-muted group-hover:scale-105 transition-transform duration-700 ease-in-out">
          Product Image
        </div>
      </div>
      <div className="text-center flex flex-col gap-2">
        <h3 className="font-heading text-[24px] leading-[32px] group-hover:text-accent transition-colors">{product.name}</h3>
        <p className="font-sans text-[16px] leading-[24px]">{formattedPrice}</p>
      </div>
    </Link>
  )
}
