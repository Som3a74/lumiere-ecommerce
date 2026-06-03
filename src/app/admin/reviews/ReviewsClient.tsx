"use client";

import { useState, useTransition } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { deleteReview } from "@/app/actions/reviews";
import { Trash2, Star } from "lucide-react";

interface Review {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  product_name: string;
  user_name: string;
}

export default function ReviewsClient({ reviews }: { reviews: Review[] }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = (reviewId: string) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    startTransition(async () => {
      const result = await deleteReview(reviewId);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-primary">Reviews</h1>
      </div>

      <div className="bg-surface-container-low rounded-md border border-surface-container overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-surface-dim text-secondary font-label-caps uppercase text-xs">
              <tr>
                <th className="px-6 py-4 font-semibold">User</th>
                <th className="px-6 py-4 font-semibold">Product</th>
                <th className="px-6 py-4 font-semibold">Rating</th>
                <th className="px-6 py-4 font-semibold">Comment</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container">
              {reviews.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-secondary">
                    No reviews found.
                  </td>
                </tr>
              ) : (
                reviews.map((review) => (
                  <tr key={review.id} className="hover:bg-surface transition-colors">
                    <td className="px-6 py-4 text-primary whitespace-nowrap font-medium">
                      {review.user_name}
                    </td>
                    <td className="px-6 py-4 text-secondary">
                      {review.product_name}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1 text-primary">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-3.5 h-3.5 ${star <= review.rating ? "fill-[var(--color-gold-accent)] text-[var(--color-gold-accent)]" : "text-surface-dim"}`}
                          />
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-secondary max-w-xs truncate">
                      {review.comment}
                    </td>
                    <td className="px-6 py-4 text-secondary whitespace-nowrap">
                      {format(new Date(review.created_at), "MMM d, yyyy")}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(review.id)}
                        disabled={isPending}
                        className="text-error hover:text-error hover:bg-error-container"
                        aria-label="Delete review"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
