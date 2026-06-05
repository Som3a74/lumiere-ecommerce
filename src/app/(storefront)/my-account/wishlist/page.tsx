import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/utils/supabase/server";
import { WishlistButton } from "@/components/shared/WishlistButton";

export default async function WishlistPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

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
    .order("created_at", { ascending: false });

  const wishlistItems = (wishlistData || []).map((item: any) => ({
    id: item.products.id,
    title: item.products.name,
    price: `$${item.products.price.toLocaleString()}`,
    imageUrl: item.products.product_images?.[0]?.image_url || "/assets/images/logo.png",
  }));

  return (
    <section>
      <div className="flex justify-between items-end border-b border-surface-container pb-4 mb-8">
        <h2 className="font-headline-md text-headline-md text-primary">Your Wishlist</h2>
        <span className="font-body-md text-secondary">{wishlistItems.length} Items</span>
      </div>
      
      {wishlistItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {wishlistItems.map((item) => (
            <div key={item.id} className="group cursor-pointer flex flex-col">
              <div className="relative aspect-[3/4] bg-surface-container overflow-hidden mb-6">
                <Link href={`/product/${item.id}`} className="block w-full h-full relative">
                  <Image
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    alt={item.title}
                    className="object-cover transform group-hover:scale-105 transition-transform duration-700 ease-in-out"
                    src={item.imageUrl}
                  />
                </Link>
                <WishlistButton 
                  productId={item.id} 
                  initialIsWishlisted={true} 
                  className="absolute top-4 right-4 z-10"
                />
              </div>
              <div className="text-center flex-grow flex flex-col justify-end">
                <Link href={`/product/${item.id}`}>
                  <h3 className="font-headline-md text-[20px] text-primary mb-2 hover:underline underline-offset-4 line-clamp-1">{item.title}</h3>
                </Link>
                <p className="font-body-md text-secondary mb-4">{item.price}</p>
                <Link href={`/product/${item.id}`} className="w-full text-center mt-auto border border-primary text-primary py-3 font-label-caps text-label-caps tracking-widest uppercase hover:bg-primary hover:text-on-primary transition-colors">
                  View Product
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-surface-container-low mt-8">
          <span className="material-symbols-outlined text-[48px] text-secondary mb-4">favorite_border</span>
          <h3 className="font-headline-md text-primary mb-2">Your wishlist is empty</h3>
          <p className="font-body-md text-secondary mb-8">Save items you love to revisit them later.</p>
          <Link href="/collections" className="inline-block border border-primary text-primary px-8 py-3 font-label-caps tracking-widest uppercase hover:bg-primary hover:text-on-primary transition-colors">
            Discover Collection
          </Link>
        </div>
      )}
    </section>
  );
}
