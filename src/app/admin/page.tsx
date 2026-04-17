import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import {
  getAllListings,
  getAllLeadRequests,
  getAllOffers,
  getAllTransactions,
  getAllUsers,
  getListingUpdateRequests,
  getAllWalletTransactions,
} from "@/lib/local-db";

export default async function AdminIndexPage() {
  await requireAdmin();

  const [listings, offers, transactions, users, updateRequests, leads, wallet] = await Promise.all([
    getAllListings(),
    getAllOffers(),
    getAllTransactions(),
    getAllUsers(),
    getListingUpdateRequests(),
    getAllLeadRequests(),
    getAllWalletTransactions(),
  ]);

  const pendingOffers = offers.filter((offer) => offer.status === "submitted").length;
  const pendingVerification = users.filter((user) => user.verificationStatus === "pending").length;
  const pendingListingUpdates = updateRequests.filter((request) => request.status === "pending").length;
  const pendingLeads = leads.filter((lead) => lead.status === "new").length;
  const pendingWallet = wallet.filter((item) => item.status === "pending").length;

  return (
    <main className="admin-shell">
      <div className="container-shell">
        <div className="admin-header">
          <div className="thula-kicker">Admin Overview</div>
          <h1 className="admin-title">Operational control room</h1>
          <p className="admin-copy">
            This pulls the existing listing, offer, verification, and transaction workflow into
            a single back-office overview without changing the underlying logic.
          </p>
        </div>

        <div className="admin-toolbar">
          <Link href="/admin/listings" className="site-nav__button">
            Listings
          </Link>
          <Link href="/admin/offers" className="site-nav__button">
            Offers
          </Link>
          <Link href="/admin/transactions" className="site-nav__button">
            Transactions
          </Link>
          <Link href="/admin/users" className="site-nav__button">
            Users
          </Link>
          <Link href="/admin/cms" className="site-nav__button">
            CMS
          </Link>
          <Link href="/admin/enquiries" className="site-nav__button">
            Enquiries
          </Link>
          <Link href="/admin/leads" className="site-nav__button">
            Leads
          </Link>
          <Link href="/admin/partners" className="site-nav__button">
            Partners
          </Link>
          <Link href="/admin/reports" className="site-nav__button">
            Reports
          </Link>
          <Link href="/admin/settings" className="site-nav__button">
            Settings
          </Link>
          <Link href="/admin/staff" className="site-nav__button">
            Staff
          </Link>
          <Link href="/admin/wallet" className="site-nav__button">
            Wallet
          </Link>
          <Link href="/admin/activity" className="site-nav__button">
            Activity
          </Link>
        </div>

        <section className="admin-overview-grid">
          <article className="account-card">
            <h3>Total Listings</h3>
            <strong>{listings.length}</strong>
            <p>{pendingListingUpdates} seller update requests pending review.</p>
          </article>
          <article className="account-card">
            <h3>Open Offers</h3>
            <strong>{pendingOffers}</strong>
            <p>{offers.length} offers recorded in total.</p>
          </article>
          <article className="account-card">
            <h3>Transactions</h3>
            <strong>{transactions.length}</strong>
            <p>Accepted offers currently in operational flow.</p>
          </article>
          <article className="account-card">
            <h3>Verification Queue</h3>
            <strong>{pendingVerification}</strong>
            <p>{users.length} users across buyer, seller, and admin roles.</p>
          </article>
          <article className="account-card">
            <h3>Lead Queue</h3>
            <strong>{pendingLeads}</strong>
            <p>New demo, bespoke, and newsletter requests awaiting review.</p>
          </article>
          <article className="account-card">
            <h3>Wallet Queue</h3>
            <strong>{pendingWallet}</strong>
            <p>Refund and top-up records pending admin action.</p>
          </article>
        </section>

        <section className="account-card admin-section-gap">
          <div className="transaction-panel__head">
            <h3>Priority queues</h3>
            <p>These link directly into the existing moderation surfaces.</p>
          </div>
          <div className="admin-priority-links">
            <Link href="/admin/offers" className="site-nav__button">
              Review pending offers
            </Link>
            <Link href="/admin/listings" className="site-nav__button">
              Review listing updates
            </Link>
            <Link href="/admin/users" className="site-nav__button">
              Review verification
            </Link>
            <Link href="/admin/transactions" className="site-nav__button">
              Manage transactions
            </Link>
            <Link href="/admin/cms" className="site-nav__button">
              Manage page content
            </Link>
            <Link href="/admin/enquiries" className="site-nav__button">
              Review enquiries
            </Link>
            <Link href="/admin/leads" className="site-nav__button">
              Review lead queues
            </Link>
            <Link href="/admin/partners" className="site-nav__button">
              Manage partners
            </Link>
            <Link href="/admin/reports" className="site-nav__button">
              View reporting
            </Link>
            <Link href="/admin/settings" className="site-nav__button">
              Manage settings
            </Link>
            <Link href="/admin/staff" className="site-nav__button">
              Manage staff roles
            </Link>
            <Link href="/admin/wallet" className="site-nav__button">
              Review wallet records
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
