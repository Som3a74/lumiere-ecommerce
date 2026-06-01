# Project Handoff & Status Report (Lumiere E-Commerce)

## 📌 Overview
Lumiere is a modern, premium e-commerce web application built using:
- **Framework**: Next.js (App Router)
- **Database / Auth**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS (Custom Design System, Vanilla CSS)

---

## 🛠️ Recent Major Architectural Refactoring
We recently executed a massive database restructuring to align the project with production-ready, scalable e-commerce standards. The old denormalized schema (which used arrays for colors/sizes) was completely replaced.

### 1. Database Schema Updates (Completed)
- **Product Variants (`product_variants`)**: Created to handle inventory professionally. 
  - Fields: `id`, `product_id`, `color`, `size`, `stock`, `price`, `compare_at_price`, `sku`.
- **Categories (`categories`)**: Replaced the old text-based category column. Products now use `category_id`.
- **Order Items & Cart (`order_items`, `cart_items`)**: Now strictly linked to a specific `variant_id` instead of a generic `product_id` to prevent data loss regarding chosen color/size.
- **Orders (`orders`)**: 
  - Status converted to a Postgres `ENUM` (`order_status`: pending, processing, shipped, delivered, cancelled).
  - Added `coupon_id` (FK to `coupons`).
- **Soft Deletes**: Added `deleted_at` to `products` to preserve order history when a product is deleted.

### 2. Frontend Integrations (Completed)
- **Product Page (`ProductDetailClient.tsx`)**: 
  - Fully dynamic variant selection. 
  - Computes exact stock dynamically based on selected color/size.
  - **Out of Stock UI**: Automatically disables buttons, lowers opacity, and draws a red diagonal strikethrough if a specific color or size has 0 stock.
  - Dynamically supports rendering custom CSS colors passed from the DB using inline styles (`style={{ backgroundColor: color }}`).
  - Renders `compare_at_price` as a crossed-out old price.
- **Cart & Checkout Actions**: Updated Server Actions to insert `variant_id`.
- **Orders History**: Updated SQL joins to fetch the chosen variant (`color`, `size`) and the exact thumbnail image corresponding to the ordered color.

---

## 🗄️ Database Scripts Reference
The following files exist in the `/supabase/` folder and have **already been executed** in the production database (without RLS):
- `schema_update.sql` / `schema_update_2.sql`: Contains the DDL to create tables, ENUMs, and Foreign Keys.
- `seed.sql`: Seeded categories (Timepieces, Leather Goods, Accessories) and a test product ("Lumiere Elite Backpack" with Yellow/Green variants and images).
- `fix_images.sql`: Ensures high-quality Unsplash images are linked to the variants.

---

## 🚀 Next Steps (Where to resume)
The core shopping experience (Browsing -> Cart -> Checkout flow -> Order History) is now structurally sound and tested. The next AI assistant should pick up from here to implement:

1. **Payment Integration**: 
   - Integrate Stripe to handle the actual payment flow during checkout instead of the current dummy flow.
2. **Admin Dashboard**: 
   - Build a comprehensive admin panel to perform CRUD operations on `products`, `product_variants`, and `categories`.
   - Add functionality to upload images and set `stock`/`sku`.
3. **Coupons / Discounts Logic**: 
   - Implement the logic to apply a coupon code at checkout, validate it, and link it to the `coupon_id` in the `orders` table.

---
**Note to the next AI Assistant:** 
*Read this file carefully. Do not revert to the old denormalized arrays (`colors`, `sizes`) for products. Always use `product_variants` and `variant_id` for cart and order operations.*
