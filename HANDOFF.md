# Project Handoff & Status Report (Lumiere E-Commerce)

## 📌 Overview

Lumiere is a modern, premium e-commerce web application built using:

- **Framework**: Next.js (App Router)
- **Database / Auth**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS (Custom Design System, Vanilla CSS)

---

## 🛠️ Recent Major Architectural Refactoring (Phase 1)

We recently executed a massive database restructuring to align the project with production-ready, scalable e-commerce standards. The old denormalized schema (which used arrays for colors/sizes) was completely replaced.

### Database Schema Updates

- **Product Variants (`product_variants`)**: Created to handle inventory professionally.
- **Categories (`categories`)**: Replaced the old text-based category column.
- **Order Items & Cart (`order_items`, `cart_items`)**: Now strictly linked to a specific `variant_id`.
- **Orders (`orders`)**: Status converted to a Postgres `ENUM`. Added `coupon_id`.
- **Soft Deletes**: Added `deleted_at` to `products`.
  > **⚠️ IMPORTANT QUERY RULE FOR FUTURE AGENTS:** Because of the soft-delete architecture, **NEVER** query the `products` table without appending `.is('deleted_at', null)`. If you fetch products for a Carousel, Collection, Search, or Admin count, you MUST filter out soft-deleted products, otherwise they will appear on the site as if they are active.

---

## 🎨 Admin Dashboard & UI Polish (Phase 2)

A massive upgrade was done to the Admin Dashboard to ensure it matches the "Quiet Luxury" aesthetic and offers complete control over the store:

### 1. UI Components Refactor

- Rewrote core Shadcn UI components (`Button`, `Select`, `DropdownMenu`) to natively support the custom design system (sharp corners, uppercase, wide tracking, custom `bg-surface`). No more messy tailwind class chains.
- Added smooth Skeleton Loaders across all admin pages.

### 2. Full Admin CRUD Implementation

- **Products & Variants**: Fully functional Creation and Edit pages. Variants now dynamically load Colors and Sizes from the DB into `<Select>` dropdowns to prevent typos.
- **Colors & Sizes Management**: Created dedicated database tables (`colors`, `sizes`) and full CRUD pages (`/admin/colors`, `/admin/sizes`) to manage them.
- **Images**: Fixed image uploading in `VariantManager` to easily link an uploaded image to a specific color variant.
- **Users Management**: Built a complete user management system (`/admin/users`) using the **Supabase Admin API** (requires `SUPABASE_SERVICE_ROLE_KEY`). Allows creating, editing (passwords/names), changing roles (admin/customer), and securely deleting users from `auth.users` and `public.profiles`.

## 💰 Phase 3: Payment & Order Management

- **Stripe Integration**: Fully integrated Stripe `<PaymentElement>` for secure, one-off checkout payments.
  - Built a custom Next.js Server Action (`placeOrder`) that securely verifies the `paymentIntent` status on the backend before finalizing the order in Supabase.
  - Replaced the dummy checkout with an elegant, "Quiet Luxury" compliant Stripe Elements form.
  - Cleaned up the UI by hiding redundant billing fields from Stripe since they are collected natively.
- **Admin Order Management (`/admin/orders`)**:
  - Created a robust Order Management Dashboard.
  - Admins can view all orders, see full payment details, and dynamically change order statuses (Pending, Processing, Shipped, Delivered, Cancelled).
  - Bypassed RLS on the `payments` table for Admins securely by utilizing the `Supabase Service Role Key` for backend fetches.

## 📊 Phase 4: Dashboard Redesign & UI Fixes

- **Dashboard Redesign**:
  - Revamped the main Admin Dashboard (`/admin`) using `shadcn/ui` and `recharts` to display dynamic Revenue and Category distribution.
  - Extracted clean, reusable dashboard components (`DashboardCard`, `DashboardCharts`) without aggressive borders, relying on subtle shadows and spacing.
- **Performance & UX (Skeleton Loading)**:
  - Implemented Skeleton Loading and React `<Suspense>` across the admin panel.
  - Fixed an issue where the main dashboard skeleton bled into nested pages (like `/admin/orders`) by creating dedicated `loading.tsx` files for sub-routes.
- **Storefront Fixes (Soft Deletes)**:
  - Fixed a critical bug where soft-deleted products (`deleted_at IS NOT NULL`) were still appearing on the public website. Filtered them out of `/collections`, `/product/[id]`, and the global `SearchModal`.

---

## ⭐ Phase 5: Storefront Polish, Coupons & Reviews (Just Completed)

- **Coupons / Discounts Logic**:
  - Built minimal Coupon input fields on the Cart and Checkout pages to align with the Quiet Luxury aesthetic.
  - Created secure Server Actions to validate active status and expiration dates, safely calculating the discount on the backend.
  - Updated the Stripe Payment Intent to reflect the discounted amount and properly store the `coupon_id` within the `orders` table.
- **Storefront Polish & Variants UI**:
  - Enhanced the Product Details page to dynamically fetch and display accurate colors and sizes directly from `product_variants`.
  - Upgraded the UI for size and color swatches (sharp corners, clear out-of-stock indicators).
  - Ensured the "Add to Cart" function passes the precise `variant_id` to handle complex inventory properly.
- **Reviews System**:
  - **Customer Facing**: Developed the `ReviewsSection` for the product page. Users can leave a 1-5 star rating and comment using `lucide-react` golden stars. It displays the top 5 reviews by default with a smooth "Show all" expansion.
  - **Admin Dashboard**: Created a protected `/admin/reviews` route to list all reviews across the store. Includes smooth Skeleton Loading and a secure "Delete" (Trash) action to moderate offensive content.

---

## 🗄️ Database Schema Reference

_Warning: This schema is for context only and is not meant to be run. Table order and constraints may not be valid for execution._

```sql
CREATE TABLE public.profiles (
  id uuid NOT NULL,
  role USER-DEFINED DEFAULT 'customer'::user_role,
  first_name text,
  last_name text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
CREATE TABLE public.products (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price numeric NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  features ARRAY,
  sales_count integer DEFAULT 0,
  category_id uuid,
  deleted_at timestamp with time zone,
  CONSTRAINT products_pkey PRIMARY KEY (id),
  CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id)
);
CREATE TABLE public.product_images (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  product_id uuid,
  image_url text NOT NULL,
  is_thumbnail boolean DEFAULT false,
  display_order integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  color text,
  CONSTRAINT product_images_pkey PRIMARY KEY (id),
  CONSTRAINT product_images_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id)
);
CREATE TABLE public.cart_items (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  product_id uuid,
  quantity integer NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  variant_id uuid,
  CONSTRAINT cart_items_pkey PRIMARY KEY (id),
  CONSTRAINT cart_items_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT cart_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id),
  CONSTRAINT cart_items_variant_id_fkey FOREIGN KEY (variant_id) REFERENCES public.product_variants(id)
);
CREATE TABLE public.wishlist_items (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  product_id uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT wishlist_items_pkey PRIMARY KEY (id),
  CONSTRAINT wishlist_items_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT wishlist_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id)
);
CREATE TABLE public.orders (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  status USER-DEFINED NOT NULL DEFAULT 'pending'::order_status,
  total_amount numeric NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  contact_info jsonb,
  shipping_address jsonb,
  payment_info jsonb,
  coupon_id uuid,
  CONSTRAINT orders_pkey PRIMARY KEY (id),
  CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT orders_coupon_id_fkey FOREIGN KEY (coupon_id) REFERENCES public.coupons(id)
);
CREATE TABLE public.order_items (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  order_id uuid,
  product_id uuid,
  quantity integer NOT NULL CHECK (quantity > 0),
  price_at_time numeric NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  variant_id uuid,
  CONSTRAINT order_items_pkey PRIMARY KEY (id),
  CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id),
  CONSTRAINT order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id),
  CONSTRAINT order_items_variant_id_fkey FOREIGN KEY (variant_id) REFERENCES public.product_variants(id)
);
CREATE TABLE public.categories (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  image_url text,
  parent_id uuid,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT categories_pkey PRIMARY KEY (id),
  CONSTRAINT categories_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.categories(id)
);
CREATE TABLE public.product_variants (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  product_id uuid,
  color text,
  size text,
  stock integer DEFAULT 0,
  price numeric,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  sku text UNIQUE,
  compare_at_price numeric,
  CONSTRAINT product_variants_pkey PRIMARY KEY (id),
  CONSTRAINT product_variants_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id)
);
CREATE TABLE public.reviews (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  product_id uuid,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT reviews_pkey PRIMARY KEY (id),
  CONSTRAINT reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT reviews_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id)
);
CREATE TABLE public.coupons (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  discount_percentage numeric CHECK (discount_percentage > 0::numeric AND discount_percentage <= 100::numeric),
  expiration_date timestamp with time zone,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT coupons_pkey PRIMARY KEY (id)
);
CREATE TABLE public.payments (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  order_id uuid,
  amount numeric NOT NULL,
  status text NOT NULL,
  provider text NOT NULL,
  details jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT payments_pkey PRIMARY KEY (id),
  CONSTRAINT payments_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id)
);
CREATE TABLE public.colors (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  hex_code text,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT colors_pkey PRIMARY KEY (id)
);
CREATE TABLE public.sizes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT sizes_pkey PRIMARY KEY (id)
);
```

---

---

## 📧 Phase 6: Email Notifications & UI Polish (Just Completed)

- **Email Receipts (Nodemailer)**:
  - Replaced the initial Resend sandbox setup with `nodemailer` to bypass free-tier domain verification limits.
  - Emails are now sent securely via Gmail SMTP using `SMTP_EMAIL` and `SMTP_PASSWORD` environment variables.
  - Built a stunning, fully-responsive "Quiet Luxury" HTML email template that dynamically injects the store's logo, maps over `cartItems` to generate an itemized receipt, and includes the user's shipping address.
- **Checkout Flow Optimization**:
  - Simplified the Stripe checkout form by removing redundant fields (`city`, `country`, `zip`) to keep the minimal aesthetic.
  - Fixed a Stripe `IntegrationError` by ensuring the "Place Order" button remains disabled until the `<PaymentElement>` is fully mounted in the accordion.
  - Adjusted the `stripe.confirmPayment` payload to strictly satisfy Stripe's validation requirements for hidden fields.
- **Layout & Responsive Fixes**:
  - **Filters (`/collections`)**: Fixed a broken flex layout where dropdowns wrapped awkwardly. Applied `md:flex-nowrap` and `items-center` to ensure a single sleek line on desktop while retaining vertical alignment.
  - **Header (`Header.tsx`)**: Rebuilt the layout logic to use `flex justify-between` on mobile (pushing the Logo to the far left and icons to the far right), while preserving the perfectly centered `lg:grid-cols-3` layout on large screens.
  - **My Account**: Cleaned up the `/my-account` page by removing broken wishlist previews and obsolete fetches.

---

## 🌟 Phase 7: SEO, Branding & User Polish (Just Completed)

- **User Profile & Order History Polish**:
  - Refined the `/my-account/wishlist` page. The "Add to Cart" button now directs users straight to the product details page (`/product/[id]`) so they can properly select their desired variant (size/color) before adding to their cart.
- **Search & Filtering Upgrades**:
  - Updated the `/collections` page to fetch categories dynamically from the database.
  - The `FiltersClient` now receives these dynamic categories, removing the need for hardcoded filter arrays while perfectly maintaining the "Quiet Luxury" aesthetic.
- **Admin Order Status Emails**:
  - Integrated `nodemailer` directly into the `updateOrderStatus` Server Action (`actions/admin-orders.ts`).
  - When an Admin changes an order status to **Shipped** or **Delivered**, a beautifully styled, branded HTML email is automatically triggered and sent to the customer to keep them updated on their purchase.
- **Advanced SEO & Branding**:
  - **JSON-LD Structured Data**: Injected `Product` schema into product pages (with dynamic pricing, inventory, and reviews) and `Organization/WebSite` schema into the homepage to ensure rich snippets in Google Search.
  - **Dynamic Metadata**: The Collections page now dynamically updates its `<title>` and OpenGraph tags based on the selected category filter (e.g., "Watches Collection | LUMIÈRE GENÈVE").
  - **Web App Manifest**: Added `manifest.ts` to improve mobile SEO and PWA compatibility.
  - **Brand Assets**: Generated and applied a high-end, minimalist custom Logo (`logo.png`) and Favicon (`icon.png`) featuring a champagne gold "L" monogram inside a stark black circle, replacing the default Next.js branding.

---

## 🏆 Phase 8: Production Audit & Architecture Finalization (Just Completed)

- **Database & Architecture Resiliency**:
  - **UUID Generation Fallback**: Fixed a critical `invalid input syntax for type uuid` Postgres error by implementing a robust `crypto.randomUUID()` fallback generator in `product-form.tsx`. This ensures the app can generate valid UUIDs even in insecure environments (e.g., local network IP) where the browser disables native crypto APIs.
  - **Upsert-Driven Product Saves**: Upgraded the `saveProduct` action (`admin-products.ts`) from a rigid `Insert` to a flexible `Upsert`. This prevents `duplicate key value violates unique constraint "products_pkey"` errors if a network timeout occurs and the user clicks "Save" multiple times.
  - **Sales Tracking Integration**: Upgraded the `checkout.ts` server action to automatically increment the `sales_count` column inside the `products` table upon a successful Stripe payment. This guarantees accurate metrics for "Best Seller" sorting and analytics.

- **Dynamic SKU Generation**:
  - Resolved an issue where new products lacked an ID for SKU creation. Now, the frontend assigns a temporary `[AUTO]` placeholder (e.g. `[AUTO]-RED-L`). Upon saving, the backend intercepts this, creates the product, fetches the real `product_id`, and seamlessly updates the SKU to a clean format (e.g., `PROD-A3D4-RED-L`).

- **Checkout & Cart UX Precision**:
  - **Variant-Specific Imagery**: Both the Cart (`/cart`) and Checkout (`/checkout`) pages now intelligently map the user's selected `variant_id` to the matching `color_id` inside `product_images`. Customers now see the **exact image** corresponding to the color they chose, rather than a generic product image.
  - **Checkout Clarity**: The Checkout page now explicitly prints the selected variant string (e.g., `Red / Large`) beneath the product title to provide maximum clarity before payment.

- **Admin UI Polish**:
  - **Image Upload Button Fix**: Replaced the Shadcn `<Input type="file">` with a native HTML `<input type="file">` for variant image uploads. This bypassed Shadcn's default `disabled:opacity-50` styling, ensuring the native "Choose File" text remains 100% invisible (`opacity-0`) while the "Uploading..." spinner is active.

---

## 🚀 Next Steps (Where to resume)

The application is highly functional, secure, styled, SEO-optimized, and **Production Ready**! The next AI assistant should pick up from here to implement **Phase 9 (Final Polish & Launch Prep)**:

1. **Analytics & Tracking Integration**:
   - Integrate Google Analytics, Vercel Web Analytics, or PostHog to track user behavior, checkout drop-offs, and conversion rates.
2. **Performance Auditing**:
   - Run Lighthouse audits to ensure images are perfectly optimized (`next/image` usage check) and font loading is non-blocking.
3. **Advanced Product Search**:
   - Upgrade the current text-based search to use a robust, typo-tolerant search solution (e.g., Supabase Vector/pgvector for semantic search, or Algolia).
4. **Production Deployment**:
   - Finalize environment variables, connect a custom domain, and handle final Vercel deployment checks.
