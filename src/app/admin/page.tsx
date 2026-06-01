import { Suspense } from "react";
import { createClient } from "@/utils/supabase/server";
import { Package, ShoppingCart, Tags } from "lucide-react";
import { DashboardCard } from "@/components/admin/dashboard-card";
import { DashboardCharts } from "@/components/admin/dashboard-charts";
import { DashboardCardSkeleton, DashboardChartsSkeleton } from "@/components/admin/skeletons";

export const metadata = {
  title: "Admin Dashboard | Lumiere",
};

// Separated stats component to allow independent Suspense loading
async function DashboardStats() {
  const supabase = await createClient();
  
  const [
    { count: productsCount },
    { count: ordersCount },
    { count: categoriesCount }
  ] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }).is("deleted_at", null),
    supabase.from("orders").select("*", { count: "exact", head: true }),
    supabase.from("categories").select("*", { count: "exact", head: true })
  ]);

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <DashboardCard
        title="Total Products"
        value={productsCount || 0}
        icon={<Package />}
        description="Active products in store"
      />
      <DashboardCard
        title="Total Orders"
        value={ordersCount || 0}
        icon={<ShoppingCart />}
        trend={{ value: 12, isPositive: true }}
      />
      <DashboardCard
        title="Categories"
        value={categoriesCount || 0}
        icon={<Tags />}
        description="Product categories"
      />
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="font-heading text-3xl font-medium tracking-tight text-primary">Dashboard</h1>
        <p className="mt-2 text-on-surface-variant">Overview of your store's performance.</p>
      </div>

      <Suspense fallback={
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <DashboardCardSkeleton />
          <DashboardCardSkeleton />
          <DashboardCardSkeleton />
        </div>
      }>
        <DashboardStats />
      </Suspense>

      <Suspense fallback={<DashboardChartsSkeleton />}>
        <DashboardCharts />
      </Suspense>
    </div>
  );
}
