import { Product, ProductCard } from "./ProductCard"

interface ProductGridProps {
  products: Product[]
  title?: string
  description?: string
}

export function ProductGrid({ products, title, description }: ProductGridProps) {
  return (
    <section className="bg-secondary">
      <div className="max-w-[1440px] mx-auto px-5 md:px-[80px] py-[128px] flex flex-col gap-[128px]">
        
        {(title || description) && (
          <div className="text-center flex flex-col items-center gap-6">
            {title && <h2 className="font-heading text-[32px] leading-[40px]">{title}</h2>}
            {description && (
              <p className="font-sans text-[16px] leading-[24px] max-w-[600px] text-muted-foreground">
                {description}
              </p>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        
      </div>
    </section>
  )
}
