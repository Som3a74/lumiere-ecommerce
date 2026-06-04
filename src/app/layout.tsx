import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";

const playfairDisplayHeading = Playfair_Display({ subsets: ['latin'], variable: '--font-heading' });

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://lumiere-ecommerce.vercel.app"),
  title: {
    template: "%s | LUMIÈRE GENÈVE",
    default: "LUMIÈRE GENÈVE - Homepage",
  },
  description: "The Art of Quiet Luxury. Precision engineering meets timeless elegance.",
  openGraph: {
    title: "LUMIÈRE GENÈVE",
    description: "The Art of Quiet Luxury. Precision engineering meets timeless elegance.",
    url: "https://lumiere-ecommerce.vercel.app",
    siteName: "LUMIÈRE GENÈVE",
    images: [
      {
        url: "/assets/images/logo.png",
        width: 800,
        height: 600,
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", "font-sans", inter.variable, playfairDisplayHeading.variable)}
    >
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col bg-background text-on-background">
        <Toaster position="top-center" />
        {children}
      </body>
    </html>
  );
}
