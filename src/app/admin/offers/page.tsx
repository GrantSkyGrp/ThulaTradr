import Link from "next/link";
import { updateOfferStatusAction } from "@/app/actions";
import { requireAdmin } from "@/lib/auth";
import { getAllOffers } from "@/lib/local-db";

export default async function AdminOffersPage() {
  await requireAdmin();
  const offers = await getAllOffers();

  return (
    <main className="admin-shell">
      <div className="container-shell">
        <div className="admin-header">
          <div className="thula-kicker">Admin Offers</div>
          <h1 className="admin-title">Buyer offer oversight</h1>
          <p className="admin-copy">
            This mirrors the internal oversight layer from the current platform: staff
            can review incoming offers independently of the buyer workspace.
          </p>
        </div>

        <div className="admin-toolbar">
          <Link href="/admin/listings" className="site-nav__button">
            Listings
          </Link>
          <Link href="/admin/offers" className="site-nav__button">
            Offers
          </Link>
        </div>

        <div className="admin-table">
          <div className="admin-table__row admin-table__row--head">
            <span>Listing</span>
            <span>Buyer</span>
            <span>Offer</span>
            <span>Payable Now</span>
            <span>Status</span>
            <span>Action</span>
          </div>
          {offers.length === 0 ? (
            <div className="admin-table__empty">No offers submitted yet.</div>
          ) : (
            offers.map((offer) => (
              <div key={offer.id} className="admin-table__row">
                <span>{offer.listingModel}</span>
                <span>{offer.userName}</span>
                <span>R {offer.amount.toLocaleString("en-ZA")}</span>
                <span>{offer.payableNow}</span>
                <span>{offer.status}</span>
                <form action={updateOfferStatusAction} className="admin-inline-form admin-inline-form--stack">
                  <input type="hidden" name="id" value={offer.id} />
                  <button
                    type="submit"
                    name="status"
                    value="accepted"
                    className="site-nav__button"
                  >
                    Accept
                  </button>
                  <button
                    type="submit"
                    name="status"
                    value="rejected"
                    className="site-nav__button"
                  >
                    Reject
                  </button>
                  <button
                    type="submit"
                    name="status"
                    value="submitted"
                    className="site-nav__button"
                  >
                    Reset
                  </button>
                </form>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
