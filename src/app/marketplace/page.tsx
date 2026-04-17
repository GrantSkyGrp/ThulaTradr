import { FleetExplorer } from "@/components/marketplace/fleet-explorer";
import { getActiveBrand } from "@/lib/branding/get-active-brand";
import { getFleetListings } from "@/lib/marketplace/listings";

export default async function MarketplacePage() {
  const brand = getActiveBrand();
  const listings = await getFleetListings();

  return (
    <main className="fleet-page-shell">
      <div className="fleet-page-banner">
        <div className="container-shell">
          <div className="fleet-page-intro">
            <div className="thula-kicker">{brand.fleet.eyebrow}</div>
            <h1 className="fleet-page-title">{brand.fleet.title}</h1>
          </div>

          <FleetExplorer filters={brand.fleet.filters} listings={listings} />
        </div>
      </div>
    </main>
  );
}
