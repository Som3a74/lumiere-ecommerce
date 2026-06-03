---
name: Quiet Luxury Signature
colors:
  surface: "#f9f9f9"
  surface-dim: "#dadada"
  surface-bright: "#f9f9f9"
  surface-container-lowest: "#ffffff"
  surface-container-low: "#f3f3f4"
  surface-container: "#eeeeee"
  surface-container-high: "#e8e8e8"
  surface-container-highest: "#e2e2e2"
  on-surface: "#1a1c1c"
  on-surface-variant: "#444748"
  inverse-surface: "#2f3131"
  inverse-on-surface: "#f0f1f1"
  outline: "#747878"
  outline-variant: "#c4c7c7"
  surface-tint: "#5f5e5e"
  primary: "#000000"
  on-primary: "#ffffff"
  primary-container: "#1c1b1b"
  on-primary-container: "#858383"
  inverse-primary: "#c8c6c5"
  secondary: "#5e5e5c"
  on-secondary: "#ffffff"
  secondary-container: "#e1dfdc"
  on-secondary-container: "#636360"
  tertiary: "#000000"
  on-tertiary: "#ffffff"
  tertiary-container: "#241a00"
  on-tertiary-container: "#a08000"
  error: "#ba1a1a"
  on-error: "#ffffff"
  error-container: "#ffdad6"
  on-error-container: "#93000a"
  primary-fixed: "#e5e2e1"
  primary-fixed-dim: "#c8c6c5"
  on-primary-fixed: "#1c1b1b"
  on-primary-fixed-variant: "#474646"
  secondary-fixed: "#e4e2de"
  secondary-fixed-dim: "#c8c6c3"
  on-secondary-fixed: "#1b1c1a"
  on-secondary-fixed-variant: "#474744"
  tertiary-fixed: "#ffe088"
  tertiary-fixed-dim: "#e9c349"
  on-tertiary-fixed: "#241a00"
  on-tertiary-fixed-variant: "#574500"
  background: "#f9f9f9"
  on-background: "#1a1c1c"
  surface-variant: "#e2e2e2"
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 64px
    fontWeight: "400"
    lineHeight: 72px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 40px
    fontWeight: "400"
    lineHeight: 48px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: "400"
    lineHeight: 40px
  headline-md:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: "400"
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: "400"
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: "400"
    lineHeight: 24px
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: "600"
    lineHeight: 16px
    letterSpacing: 0.1em
spacing:
  unit: 8px
  container-max: 1440px
  gutter: 32px
  margin-desktop: 80px
  margin-tablet: 40px
  margin-mobile: 20px
  section-gap: 128px
---

## Brand & Style

The design system is rooted in the philosophy of "Quiet Luxury"—an aesthetic that prioritizes understatement, impeccable craft, and a sense of timelessness. It targets a discerning, high-net-worth audience that values substance over flash.

The visual style is a fusion of **High-End Minimalism** and **Editorial Sophistication**. It utilizes vast amounts of "breathing room" (whitespace) to frame products as gallery pieces. The emotional response is one of calm, exclusivity, and unwavering confidence. Every interaction must feel intentional and deliberate, avoiding unnecessary animation or decorative clutter.

## Colors

The palette is restricted to a classic, high-contrast foundation to ensure the photography remains the focal point.

- **Primary (Deep Charcoal):** Used for typography, iconography, and primary CTA backgrounds. It provides the "weight" and authority of the design.
- **Backgrounds (White & Soft Ivory):** A dual-tone background strategy. Pure White (#FFFFFF) is used for main content areas and product grids to ensure clarity. Soft Ivory (#FDFBF7) is used for section breaks, editorial pull-outs, and secondary containers to add warmth and depth.
- **Accent (Muted Champagne Gold):** Used with extreme restraint. This color is reserved for subtle highlights, such as active states, small decorative lines, or "Limited Edition" badges. It should never dominate the screen.

## Typography

This design system employs a high-contrast typographic pairing to signal luxury.

- **Headlines:** Use **Playfair Display**. It should be set with generous leading and occasional italicization for emphasis in editorial layouts. Larger display sizes should use slight negative letter-spacing to feel more "locked" and intentional.
- **Body & UI:** Use **Inter**. This provides a neutral, highly legible counterpoint to the decorative serif.
- **Labels:** Small labels and overlines should always be set in uppercase Inter with increased letter-spacing (tracking) to evoke the feel of high-end watch face engravings.

## Layout & Spacing

The layout follows a **Strict Fixed Grid** philosophy on desktop to maintain an architectural sense of order.

- **Grid:** A 12-column grid with generous 32px gutters.
- **Margins:** Desktop margins are intentionally wide (80px) to squeeze the content and create a sense of focused luxury.
- **Rhythm:** We use a base-8 spacing scale. Vertical gaps between major sections are aggressive (128px) to allow each product or story to stand alone without competition.
- **Mobile:** On mobile devices, the margins shrink to 20px, and the layout collapses to a single-column view for product details, while maintaining a 2-column staggered grid for product listing pages to maintain visual interest.

## Elevation & Depth

To maintain the "Quiet Luxury" aesthetic, this design system avoids traditional drop shadows. Depth is communicated through:

- **Tonal Layering:** Placing White cards on Soft Ivory backgrounds to create a subtle perceived lift.
- **Glassmorphism:** The global header uses a 20px Backdrop Blur with a 90% opaque White tint. This allows product imagery to bleed behind the navigation, creating a sense of continuity and transparency.
- **Hairline Outlines:** Elements like input fields and cards use 1px solid borders in a very light grey (#EEEEEE) rather than shadows.
- **Stark Overlays:** Modals and menus use a high-opacity Deep Charcoal dimming effect (80% opacity) for the background to completely isolate the user’s focus.

## Shapes

The shape language is **Strictly Geometric**.

A `roundedness` of `0` (Sharp) is used for all primary UI elements including buttons, input fields, and product imagery. This architectural sharpness communicates precision, technical mastery (essential for luxury watches), and a "no-compromise" attitude.

Roundness is only permitted for circular functional elements like color swatches or radio selection indicators.

## Components

- **Buttons:** Primary buttons are solid Deep Charcoal with White text, featuring sharp corners and a subtle "Gold" underline or border transition on hover. Text is always uppercase Inter.
- **Product Cards:** Minimalist design with no visible borders. The image takes up 100% of the card width. Text (Product Name and Price) is center-aligned below the image using Playfair Display for the name and Inter for the price.
- **Header:** A sticky, blurring bar with a centered logo. Navigation links use the `label-caps` typography style.
- **Accordions:** Used for "Technical Specifications" and "Shipping & Returns." These use a simple 1px horizontal divider and a plus/minus icon, avoiding bulky "box" containers.
- **Input Fields:** Bottom-border only (underline style) to maintain a light, airy feel. The label floats above the line in `label-caps` when the field is active.
- **Mega Footer:** A 4-column structured layout on a Soft Ivory background, containing deep links, newsletter signups, and brand heritage stories.
