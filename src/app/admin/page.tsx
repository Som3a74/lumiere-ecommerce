import { createClient } from "@/utils/supabase/server";

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  
  // Basic stats
  const { count: productsCount } = await supabase.from('products').select('*', { count: 'exact', head: true });
  const { count: ordersCount } = await supabase.from('orders').select('*', { count: 'exact', head: true });
  const { count: categoriesCount } = await supabase.from('categories').select('*', { count: 'exact', head: true });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-3xl font-medium tracking-tight text-primary">Dashboard</h1>
        <p className="mt-2 text-on-surface-variant">Overview of your store's performance.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="border border-outline-variant/50 bg-surface p-6 shadow-sm">
          <h2 className="text-sm font-medium uppercase tracking-widest text-on-surface-variant">Total Products</h2>
          <p className="mt-2 text-4xl font-light text-primary">{productsCount || 0}</p>
        </div>
        <div className="border border-outline-variant/50 bg-surface p-6 shadow-sm">
          <h2 className="text-sm font-medium uppercase tracking-widest text-on-surface-variant">Total Orders</h2>
          <p className="mt-2 text-4xl font-light text-primary">{ordersCount || 0}</p>
        </div>
        <div className="border border-outline-variant/50 bg-surface p-6 shadow-sm">
          <h2 className="text-sm font-medium uppercase tracking-widest text-on-surface-variant">Categories</h2>
          <p className="mt-2 text-4xl font-light text-primary">{categoriesCount || 0}</p>
        </div>
      </div>
    </div>
  );
}
