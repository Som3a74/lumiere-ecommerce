import { createClient } from "@/utils/supabase/server";
import { RevenueChart } from "./charts/revenue-chart";
import { CategoriesChart } from "./charts/categories-chart";

export async function DashboardCharts() {
  const supabase = await createClient();

  // Fetch categories to show product distribution
  const { data: categories } = await supabase.from("categories").select("id, name");
  const { data: products } = await supabase.from("products").select("category_id").is("deleted_at", null);

  let categoryData: { name: string; value: number }[] = [];
  
  if (categories && products) {
    categoryData = categories.map((cat) => ({
      name: cat.name,
      value: products.filter((p) => p.category_id === cat.id).length,
    })).filter(c => c.value > 0);
  }

  // Fetch orders to calculate basic revenue over the last 6 months
  // For a real app, this should be an aggregated query or a view
  const { data: orders } = await supabase.from("orders").select("created_at, total_amount").order("created_at", { ascending: false }).limit(100);

  let revenueData: { month: string; revenue: number }[] = [];
  
  if (orders) {
    const revenueByMonth: Record<string, number> = {};
    orders.forEach((order) => {
      const date = new Date(order.created_at);
      const month = date.toLocaleString("default", { month: "short" });
      if (!revenueByMonth[month]) {
        revenueByMonth[month] = 0;
      }
      revenueByMonth[month] += Number(order.total_amount) || 0;
    });

    revenueData = Object.entries(revenueByMonth)
      .map(([month, revenue]) => ({ month, revenue }))
      .reverse() // Sort chronologically based on how we fetched
      .slice(0, 6); // Last 6 months
  }

  // Fallback data if empty
  if (revenueData.length === 0) {
    revenueData = [
      { month: "Jan", revenue: 4000 },
      { month: "Feb", revenue: 3000 },
      { month: "Mar", revenue: 2000 },
      { month: "Apr", revenue: 2780 },
      { month: "May", revenue: 1890 },
      { month: "Jun", revenue: 2390 },
    ];
  }

  if (categoryData.length === 0) {
    categoryData = [
      { name: "Watches", value: 400 },
      { name: "Accessories", value: 300 },
      { name: "Straps", value: 300 },
    ];
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <RevenueChart data={revenueData} />
      <CategoriesChart data={categoryData} />
    </div>
  );
}
