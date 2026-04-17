import Link from "next/link";
import { notFound } from "next/navigation";
import { ListingGallery } from "@/components/marketplace/listing-gallery";
import { OfferPanel } from "@/components/marketplace/offer-panel";
import { getCurrentUser } from "@/lib/auth";
import { getFleetListingBySlug } from "@/lib/marketplace/listings";

type ListingPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return [
    { slug: "thula-esv-explorer-tx-145" },
    { slug: "thula-esv-safari-xl-tx-234" },
    { slug: "thula-esv-reserve-pro-tx-327" },
  ];
}

export default async function FleetListingPage({ params }: ListingPageProps) {
  const { slug } = await params;
  const listing = await getFleetListingBySlug(slug);
  const user = await getCurrentUser();

  if (!listing) {
    notFound();
  }

  return (
    <main className="listing-detail-shell">
      <div className="container-shell listing-detail">
        <div className="listing-detail__back">
          <Link href="/marketplace">Back to Marketplace</Link>
        </div>

        <div className="listing-detail__grid">
          <section className="listing-detail__media">
            <div className="listing-detail__tabs">
              <button type="button" className="listing-tab listing-tab--active">
                Image View
              </button>
              <button type="button" className="listing-tab">
                Price View
              </button>
            </div>

            <ListingGallery model={listing.model} imageUrls={listing.imageUrls} />
          </section>

          <section className="listing-detail__summary">
            <div className="listing-summary-card">
              <div className="listing-summary-card__title">
                <h1>{listing.model}</h1>
                {listing.verified ? (
                  <span className="fleet-verified-badge">Verified</span>
                ) : null}
              </div>

              <p className="listing-summary-card__code">{listing.code}</p>

              <div className="listing-summary-card__facts">
                <div>
                  <h5>Serial Number</h5>
                  <strong>{listing.serialLabel}</strong>
                </div>
                <div>
                  <h5>Reserve Price</h5>
                  <strong>{listing.reservePrice}</strong>
                </div>
              </div>
            </div>

            <OfferPanel
              listingSlug={listing.slug}
              model={listing.model}
              currentListPrice={listing.currentListPrice}
              status={listing.status}
              userEmail={user?.email ?? null}
            />
          </section>
        </div>

        <section className="listing-description-card">
          <h3>Description</h3>
          <p>{listing.description}</p>
        </section>
      </div>
    </main>
  );
}
