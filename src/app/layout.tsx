import type { Metadata } from "next";
import { DM_Sans, Chakra_Petch } from "next/font/google";
import "./globals.css";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getActiveBrand } from "@/lib/branding/get-active-brand";

const bodyFont = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
});

const displayFont = Chakra_Petch({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const brand = getActiveBrand();

export const metadata: Metadata = {
  title: `${brand.name} Platform`,
  description: brand.metaDescription,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-brand={brand.slug}
      className={`${bodyFont.variable} ${displayFont.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <div className="site-chrome">
          <SiteHeader brand={brand} />
          {children}
          <SiteFooter brand={brand} />
        </div>
      </body>
    </html>
  );
}
