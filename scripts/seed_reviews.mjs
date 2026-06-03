import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xtthwsdnpodjzfmnfxkj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0dGh3c2RucG9kanpmbW5meGtqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDA4ODcxNSwiZXhwIjoyMDk1NjY0NzE1fQ.3enjGLfiALk7SY8qgCTBryIMmv2Y237w66iKdpWGQ48'; // This is the SUPABASE_SERVICE_ROLE_KEY from .env.local

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const comments = [
  "Absolutely stunning timepiece. The craftsmanship is beyond what I expected. Highly recommended!",
  "A beautiful watch that gets me compliments every time I wear it. The weight and feel are perfect.",
  "Very elegant and precise. The shipping was fast and the packaging was incredibly luxurious.",
  "Good watch but the strap was slightly stiff at first. It broke in nicely after a few days of wear.",
  "This is my second purchase from Lumière and they never disappoint. Exceptional quality.",
  "A true masterpiece of horology. The attention to detail on the dial is mesmerizing.",
  "Looks even better in person than in the photos. Completely satisfied with my purchase.",
  "The perfect dress watch. It slides easily under a cuff and has a very understated elegance.",
  "I was hesitant about the size, but it fits perfectly. Excellent customer service as well.",
  "Incredible value for the level of finishing. I will definitely be buying another one soon.",
  "A beautiful addition to my collection. The movement is smooth and accurate.",
  "Gorgeous design, but I wish it had slightly better water resistance. Still 5 stars for the look.",
  "Exquisite piece. The way the light plays on the crystal and dial is simply breathtaking."
];

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomRating() {
  return Math.random() > 0.8 ? 4 : 5; // Mostly 5 stars, some 4 stars
}

async function main() {
  try {
    // 1. Get 2 products
    const { data: products, error: productError } = await supabase
      .from('products')
      .select('id')
      .is('deleted_at', null)
      .limit(2);

    if (productError || !products || products.length === 0) {
      console.error("Error fetching products:", productError);
      return;
    }

    // 2. Get some users to use as reviewers
    // We can query auth.users if we have service_role, but it's easier to query profiles
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .limit(5);

    if (profileError || !profiles || profiles.length === 0) {
      console.error("Error fetching profiles (users):", profileError);
      return;
    }

    const reviewsToInsert = [];

    // Create 8-12 reviews for each of the 2 products
    for (const product of products) {
      const numReviews = Math.floor(Math.random() * 5) + 8; // 8 to 12 reviews
      for (let i = 0; i < numReviews; i++) {
        const randomUser = getRandomItem(profiles);
        const randomComment = getRandomItem(comments);
        const randomRating = getRandomRating();

        // Create a random date within the last 30 days
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * 30));

        reviewsToInsert.push({
          product_id: product.id,
          user_id: randomUser.id,
          rating: randomRating,
          comment: randomComment,
          created_at: date.toISOString(),
        });
      }
    }

    // Insert into DB
    const { data, error } = await supabase
      .from('reviews')
      .insert(reviewsToInsert);

    if (error) {
      console.error("Error inserting reviews:", error);
    } else {
      console.log(`Successfully inserted ${reviewsToInsert.length} reviews for ${products.length} products.`);
    }

  } catch (err) {
    console.error("Unexpected error:", err);
  }
}

main();
