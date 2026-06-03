# 🌟 LUMIÈRE GENÈVE - Premium E-Commerce Platform

[![Next.js](https://img.shields.io/badge/Next.js-15.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Stripe](https://img.shields.io/badge/Stripe-Payments-635BFF?style=for-the-badge&logo=stripe)](https://stripe.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

**Lumiere** is a sophisticated, full-stack e-commerce web application meticulously crafted to embody the essence of "Quiet Luxury." It merges cutting-edge web technologies to deliver an exceptional, seamless shopping experience alongside a comprehensive and professional administrative dashboard.

---

## 🛠️ Tech Stack

This project is built using modern, highly stable technologies to ensure superior performance, security, and scalability:

- **Core Framework:** [Next.js (App Router)](https://nextjs.org/) for building lightning-fast interfaces with Server-Side Rendering (SSR) and advanced SEO capabilities.
- **Database & Authentication:** [Supabase](https://supabase.com/) leveraging a powerful PostgreSQL database with robust security policies.
- **Payment Gateway:** [Stripe](https://stripe.com/) integration for secure, enterprise-grade payment processing.
- **Styling & UI:** Tailwind CSS powered by a bespoke design system, complemented by highly customizable [shadcn/ui](https://ui.shadcn.com/) components.
- **Email Notifications:** Nodemailer for automated, branded email receipts and order status updates.
- **State Management & Validation:** React Hook Form coupled with Zod for rigorous, type-safe data validation.

---

## 🎨 Design Philosophy

The platform's aesthetic is rooted in the **"Quiet Luxury"** design philosophy, emphasizing:

- **Color Palette:** A classic, high-contrast palette utilizing Deep Charcoal, Crisp White, Soft Ivory, and subtle Champagne Gold accents.
- **Typography:** **Playfair Display** for elegant, editorial headlines, paired with **Inter** for highly legible, modern body text.
- **Whitespace:** Expansive use of negative space to frame products like art gallery pieces.
- **Geometric Precision:** Sharp, 0px border-radius components (buttons, cards) to communicate precision, mastery, and architectural order.

---

## ✨ Key Features

### 1. Storefront Experience
- **Advanced Product Catalog:** Detailed product displays with dynamic variant support (colors, sizes) queried directly from the database in real-time.
- **Cart & Secure Checkout:** A frictionless cart system with advanced coupon discount logic, fully integrated with Stripe Elements for secure payment capturing.
- **Customer Reviews:** A 5-star rating system allowing users to leave feedback, featuring top reviews gracefully presented on product pages.
- **Customer Portal:** A dedicated "My Account" area for users to track their order history and manage their wishlist.

### 2. Admin Dashboard
- **Comprehensive Store Management:** Full CRUD (Create, Read, Update, Delete) interfaces for precise management of Products, Variants, Colors, and Sizes.
- **Order Processing:** Robust order tracking with the ability to transition order states (Pending, Processing, Shipped, Delivered).
- **Automated Email Triggers:** Status updates (e.g., "Shipped" or "Delivered") automatically trigger beautifully styled HTML email notifications to the customer via Nodemailer.
- **User Moderation:** High-security user management system allowing admins to control roles and modify user data safely.
- **Sales Analytics:** Interactive revenue and category distribution charts powered by Recharts for data-driven insights.

### 3. SEO & Performance Optimization
- **Structured Data (JSON-LD):** Dynamically injected schemas for Products and Organizations to secure Rich Snippets in Google Search results.
- **Dynamic Metadata:** Programmatic generation of `<title>` and OpenGraph tags based on selected categories and specific product data.
- **Perceived Performance:** Implementation of React `<Suspense>` and elegant Skeleton loading screens to ensure a consistently fast and smooth user experience.

---

## 🗄️ Database Architecture

The PostgreSQL database was fundamentally engineered to support scalable, enterprise-level e-commerce operations:

- **Variant Normalization:** Inventory is professionally managed by decoupling products into specific `product_variants` (color, size, unique price, isolated stock count).
- **Soft Deletes:** Products are never permanently deleted to maintain historical order integrity. Instead, a `deleted_at` timestamp is applied and filtered globally.
- **Core Tables:** `products`, `product_variants`, `categories`, `orders`, `order_items`, `cart_items`, `reviews`, `coupons`, `colors`, `sizes`, `profiles`.

---

## 🚀 Getting Started

To run this project locally, follow these steps:

### 1. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 2. Start the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
