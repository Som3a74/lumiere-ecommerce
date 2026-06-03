"use client";

import { useState, useTransition } from "react";
import { addReview } from "@/app/actions/reviews";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { format } from "date-fns";
import { Star } from "lucide-react";

interface Review {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  user_name: string;
}

interface ReviewsSectionProps {
  productId: string;
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1 text-primary">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${star <= rating ? "fill-[var(--color-gold-accent)] text-[var(--color-gold-accent)]" : "text-surface-dim"}`}
        />
      ))}
    </div>
  );
}

export function ReviewsSection({ productId, reviews, averageRating, totalReviews }: ReviewsSectionProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isPending, startTransition] = useTransition();
  const [showAll, setShowAll] = useState(false);

  const displayedReviews = showAll ? reviews : reviews.slice(0, 5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error("Please enter a comment.");
      return;
    }

    startTransition(async () => {
      const result = await addReview(productId, rating, comment);
      if (result.success) {
        toast.success(result.message);
        setComment("");
        setRating(5);
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <div className="mt-16 pt-16 border-t border-surface-container">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
        {/* Reviews Summary */}
        <div className="md:col-span-4 flex flex-col items-start mb-8 md:mb-0">
          <h2 className="font-headline-md text-headline-md text-primary mb-4">Customer Reviews</h2>
          {totalReviews > 0 ? (
            <div className="flex items-center gap-4 mb-2">
              <span className="font-display-lg text-primary">{averageRating.toFixed(1)}</span>
              <div className="flex flex-col">
                <StarRating rating={Math.round(averageRating)} />
                <span className="font-body-md text-secondary mt-1">{totalReviews} {totalReviews === 1 ? 'Review' : 'Reviews'}</span>
              </div>
            </div>
          ) : (
            <p className="font-body-md text-secondary">No reviews yet. Be the first to share your thoughts.</p>
          )}
        </div>

        {/* Reviews List & Form */}
        <div className="md:col-span-8 flex flex-col gap-12">
          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-surface-container-low p-6 md:p-8">
            <h3 className="font-label-caps text-label-caps text-primary uppercase mb-6 tracking-widest">Write a Review</h3>
            <div className="mb-6">
              <label className="font-label-caps text-secondary block mb-3 uppercase tracking-widest">Rating</label>
              <div className="flex gap-2 text-primary cursor-pointer">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-6 h-6 ${star <= rating ? "fill-[var(--color-gold-accent)] text-[var(--color-gold-accent)]" : "text-surface-dim"}`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-6">
              <label htmlFor="comment" className="font-label-caps text-secondary block mb-3 uppercase tracking-widest">Review</label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                disabled={isPending}
                rows={4}
                className="w-full bg-transparent border border-surface-container focus:border-primary p-4 font-body-md text-primary outline-none transition-colors resize-none placeholder-outline-variant"
                placeholder="Share your experience with this timepiece..."
              />
            </div>
            <Button
              type="submit"
              disabled={isPending}
              variant="default"
              size="lg"
              className="rounded-none uppercase text-on-primary font-label-caps tracking-widest"
            >
              {isPending ? "Submitting..." : "Submit Review"}
            </Button>
          </form>

          {/* List */}
          {reviews.length > 0 && (
            <div className="space-y-8">
              {displayedReviews.map((review) => (
                <div key={review.id} className="border-b border-surface-container pb-8 last:border-b-0">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="font-headline-md text-primary mb-1">{review.user_name}</div>
                      <div className="font-body-md text-secondary text-sm">
                        {format(new Date(review.created_at), "MMMM d, yyyy")}
                      </div>
                    </div>
                    <StarRating rating={review.rating} />
                  </div>
                  <p className="font-body-md text-primary leading-relaxed whitespace-pre-wrap">
                    {review.comment}
                  </p>
                </div>
              ))}
              
              {!showAll && reviews.length > 5 && (
                <div className="pt-4 text-center">
                  <Button
                    variant="outline"
                    onClick={() => setShowAll(true)}
                    className="rounded-none uppercase font-label-caps tracking-widest text-primary border-surface-container hover:bg-surface-container"
                  >
                    Show all {reviews.length} reviews
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
