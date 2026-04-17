import Link from "next/link";
import type { BrandConfig } from "@/lib/branding/types";

type MarketingHeroProps = {
  brand: BrandConfig;
};

export function MarketingHero({ brand }: MarketingHeroProps) {
  return (
    <section className="thula-hero">
      {/* Video background sourced directly from thula.africa CDN */}
      <video
        className="thula-hero__bg"
        autoPlay
        muted
        loop
        playsInline
        poster="https://thula.africa/images/IMG_9501.png"
      >
        <source
          src="https://media.thula.africa/videos/Website_Cover_002.mov"
          type="video/mp4"
        />
      </video>

      <div className="container-shell">
        <div className="thula-copy">
          <div className="thula-kicker">{brand.hero.eyebrow}</div>

          <h1 className="thula-hero-title">
            {brand.hero.title.split("\n").map((line, i) => (
              <span key={i} style={{ display: "block" }}>
                {line}
              </span>
            ))}
          </h1>

          <div className="thula-actions">
            <Link href="/esv" className="button-primary">
              {brand.hero.primaryCta}
            </Link>
            <Link href="/contact" className="button-secondary">
              {brand.hero.secondaryCta}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
