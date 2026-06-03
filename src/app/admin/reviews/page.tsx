import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import ReviewsClient from "./ReviewsClient";

export default async function AdminReviewsPage() {
  const supabase = await createClient();

  // Verify admin access
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    redirect("/auth/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    redirect("/my-account");
  }

  // Fetch all reviews with product info
  const { data: reviewsData, error } = await supabase
    .from("reviews")
    .select(`
      id,
      rating,
      comment,
      created_at,
      user_id,
      product:products (
        name
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching reviews:", error);
  }

  // Fetch profiles for users to show names
  let formattedReviews: any[] = [];
  if (reviewsData && reviewsData.length > 0) {
    const userIds = Array.from(new Set(reviewsData.map(r => r.user_id).filter(Boolean)));
    const { data: profilesData } = await supabase
      .from("profiles")
      .select("id, first_name, last_name, role")
      .in("id", userIds);

    const profilesMap = (profilesData || []).reduce((acc: any, p: any) => {
      acc[p.id] = p;
      return acc;
    }, {});

    formattedReviews = reviewsData.map((r: any) => {
      const product = Array.isArray(r.product) ? r.product[0] : r.product;
      return {
        id: r.id,
        rating: r.rating,
        comment: r.comment,
        created_at: r.created_at,
        product_name: product?.name || "Unknown Product",
        user_name: profilesMap[r.user_id]
          ? `${profilesMap[r.user_id].first_name || ""} ${profilesMap[r.user_id].last_name || ""}`.trim() || "Customer"
          : "Customer",
      };
    });
  }

  return <ReviewsClient reviews={formattedReviews} />;
}
