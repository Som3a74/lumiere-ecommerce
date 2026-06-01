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

## 📊 Phase 4: Dashboard Redesign & UI Fixes (Just Completed)
- **Dashboard Redesign**: 
  - Revamped the main Admin Dashboard (`/admin`) using `shadcn/ui` and `recharts` to display dynamic Revenue and Category distribution.
  - Extracted clean, reusable dashboard components (`DashboardCard`, `DashboardCharts`) without aggressive borders, relying on subtle shadows and spacing.
- **Performance & UX (Skeleton Loading)**:
  - Implemented Skeleton Loading and React `<Suspense>` across the admin panel. 
  - Fixed an issue where the main dashboard skeleton bled into nested pages (like `/admin/orders`) by creating dedicated `loading.tsx` files for sub-routes.
- **Storefront Fixes (Soft Deletes)**:
  - Fixed a critical bug where soft-deleted products (`deleted_at IS NOT NULL`) were still appearing on the public website. Filtered them out of `/collections`, `/product/[id]`, and the global `SearchModal`.

---

## 🗄️ Database Schema Reference
*Warning: This schema is for context only and is not meant to be run. Table order and constraints may not be valid for execution.*

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

## 🚀 Next Steps (Where to resume)
The core shopping experience, secure Stripe checkout, and the Admin Dashboard are now completely functional! The next AI assistant should pick up from here to implement:

1. **Coupons / Discounts Logic**: 
   - Ensure the logic to apply a coupon code at checkout works, validate it, and link it to the `coupon_id` in the `orders` table. Update the Cart and Checkout totals to reflect the discount dynamically.
2. **User Facing Store Polish**:
   - Ensure the store navigation, search, and filtering are correctly wired up with the new database structure and handle variant fetching (colors/sizes) properly.
3. **Reviews System**:
   - Implement the frontend UI for customers to leave reviews on products, and display the average star rating dynamically.
