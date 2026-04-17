import Link from "next/link";
import { updateOfferStatusAction } from "@/app/actions";
import { requireSeller } from "@/lib/auth";
import { getOffersBySellerId } from "@/lib/local-db";

export default async function SellerOffersPage() {
  const seller = await requireSeller();
  const offers = await getOffersBySellerId(seller.id);

  return (
    <main className="seller-shell">
      <div className="container-shell">
        <div className="seller-header">
          <div className="thula-kicker">Seller Workspace</div>
          <h1 className="admin-title">Offer inbox</h1>
          <p className="admin-copy">
            This is the seller-side offer review layer for owned fleet, kept separate from
            the broader admin oversight.
          </p>
        </div>

        <div className="admin-toolbar">
          <Link href="/seller/listings" className="site-nav__button">
            My Fleet
          </Link>
          <Link href="/seller/offers" className="site-nav__button">
            Offer Inbox
          </Link>
          <Link href="/seller/transactions" className="site-nav__button">
            Seller Transactions
          </Link>
        </div>

        <div className="admin-table">
          <div className="admin-table__row admin-table__row--head">
            <span>Listing</span>
            <span>Buyer</span>
            <span>Offer</span>
            <span>Buyer Terms</span>
            <span>Status</span>
            <span>Action</span>
          </div>
          {offers.length === 0 ? (
            <div className="admin-table__empty">No offers for your fleet yet.</div>
          ) : (
            offers.map((offer) => (
              <div key={offer.id} className="admin-table__row">
                <span>{offer.listingModel}</span>
                <span>{offer.userName}</span>
                <span>R {offer.amount.toLocaleString("en-ZA")}</span>
                <span>{offer.buyerTermsAccepted ? "Accepted" : "Pending"}</span>
                <span>{offer.status}</span>
                <form action={updateOfferStatusAction} className="admin-inline-form admin-inline-form--stack">
                  <input type="hidden" name="id" value={offer.id} />
                  <button type="submit" name="status" value="accepted" className="site-nav__button">
                    Accept
                  </button>
                  <button type="submit" name="status" value="rejected" className="site-nav__button">
                    Reject
                  </button>
                  <button type="submit" name="status" value="submitted" className="site-nav__button">
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
