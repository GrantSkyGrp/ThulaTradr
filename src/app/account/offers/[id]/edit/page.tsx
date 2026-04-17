import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { updateBuyerOfferAction } from "@/app/actions";
import { requireUser } from "@/lib/auth";
import { getListingBySlug, getOfferById, getSiteSettings } from "@/lib/local-db";
import { parseCurrency } from "@/lib/marketplace/format";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default async function EditOfferPage({ params, searchParams }: PageProps) {
  const user = await requireUser();
  const { id } = await params;
  const query = await searchParams;
  const offer = await getOfferById(id);

  if (!offer) {
    notFound();
  }

  if (offer.userId !== user.id || offer.status !== "submitted") {
    redirect("/account/offers");
  }

  const [listing, settings] = await Promise.all([
    getListingBySlug(offer.listingSlug),
    getSiteSettings(),
  ]);

  if (!listing) {
    notFound();
  }

  const currentListPrice = settings?.globalListPrice ?? listing.currentListPrice;
  const listPrice = parseCurrency(currentListPrice);
  const serviceFee = offer.amount * 0.015;
  const payableNow = Math.max(offer.amount - listPrice, 0) + serviceFee;

  return (
    <main className="account-shell">
      <div className="container-shell">
        <section className="offer-edit">
          <div className="offer-edit__summary">
            <div className="thula-kicker">Update Offer</div>
            <h1>{offer.listingModel}</h1>
            <p>{listing.code}</p>

            <dl>
              <div>
                <dt>Serial Number</dt>
                <dd>{listing.serialLabel || listing.code}</dd>
              </div>
              <div>
                <dt>Current List Price</dt>
                <dd>{currentListPrice}</dd>
              </div>
              <div>
                <dt>Current Payable Now</dt>
                <dd>{formatCurrency(payableNow)}</dd>
              </div>
            </dl>
          </div>

          <form action={updateBuyerOfferAction} className="offer-edit__form">
            <input type="hidden" name="offerId" value={offer.id} />
            <div className="offer-edit__current">
              <span>Current Offer</span>
              <strong>{formatCurrency(offer.amount)}</strong>
            </div>
            <label>
              <span>New Offer Amount</span>
              <input
                name="amount"
                inputMode="decimal"
                defaultValue={String(Math.round(offer.amount))}
                aria-describedby={query.error ? "offer-edit-error" : undefined}
              />
            </label>

            {query.error ? (
              <p id="offer-edit-error" className="offer-edit__error">
                Enter an offer equal to or above the current list price.
              </p>
            ) : null}

            <p className="offer-edit__note">
              You can update this offer while it is still pending. Once the seller accepts or
              declines it, the offer can no longer be changed.
            </p>

            <div className="offer-edit__actions">
              <button type="submit" className="offer-row__button">
                Update Offer
              </button>
              <Link href="/account/offers" className="button-secondary--outline">
                Cancel
              </Link>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
