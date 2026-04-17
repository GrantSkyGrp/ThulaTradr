import Link from "next/link";
import type { BrandConfig } from "@/lib/branding/types";
import { BrandLogo } from "@/components/layout/brand-logo";

type SiteFooterProps = {
  brand: BrandConfig;
};

export function SiteFooter({ brand }: SiteFooterProps) {
  return (
    <footer className="site-footer">
      <div className="container-shell site-footer__inner">
        <div className="site-footer__left">
          <BrandLogo href="/" className="site-footer__brand" />
          <address className="site-footer__address">{brand.contactAddress}</address>
        </div>

        <div className="site-footer__right">
          <Link href="/esv">ESV</Link>
          <Link href="/marketplace">Marketplace</Link>
          <Link href="/boat">eBoat</Link>
          <Link href="/contact">Contact</Link>
          <a href={`mailto:${brand.contactEmail}`}>{brand.contactEmail}</a>
          <span className="site-footer__copyright">{"\u00A9"} {new Date().getFullYear()} Thula Cloud</span>
        </div>
      </div>
    </footer>
  );
}
