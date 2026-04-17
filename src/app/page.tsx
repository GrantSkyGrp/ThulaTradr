import { HomeSections } from "@/components/marketing/home-sections";
import { MarketingHero } from "@/components/marketing/marketing-hero";
import { getActiveBrand } from "@/lib/branding/get-active-brand";
import { getPageContent } from "@/lib/local-db";

export default async function HomePage() {
  const brand = getActiveBrand();
  const content = await getPageContent("home");

  const pageBrand = content
    ? {
        ...brand,
        hero: {
          ...brand.hero,
          eyebrow: content.eyebrow,
          title: content.title,
          subtitle: content.description,
        },
      }
    : brand;

  return (
    <main className="thula-home">
      <MarketingHero brand={pageBrand} />
      <HomeSections brand={pageBrand} />
    </main>
  );
}
