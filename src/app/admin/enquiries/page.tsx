import Link from "next/link";
import { updateContactRequestStatusAction } from "@/app/actions";
import { requireAdmin } from "@/lib/auth";
import { getAllContactRequests } from "@/lib/local-db";

export default async function AdminEnquiriesPage() {
  await requireAdmin();
  const enquiries = await getAllContactRequests();

  return (
    <main className="admin-shell">
      <div className="container-shell">
        <div className="admin-header">
          <div className="thula-kicker">Admin Enquiries</div>
          <h1 className="admin-title">Contact request inbox</h1>
          <p className="admin-copy">
            This is the first enquiry-management surface for the rewrite, aligned to the
            Laravel admin contact/demo inbox pattern.
          </p>
        </div>

        <div className="admin-toolbar">
          <Link href="/admin" className="site-nav__button">
            Overview
          </Link>
          <Link href="/admin/cms" className="site-nav__button">
            CMS
          </Link>
          <Link href="/admin/enquiries" className="site-nav__button">
            Enquiries
          </Link>
        </div>

        <div className="account-list">
          {enquiries.length === 0 ? (
            <article className="account-card">
              <h3>No enquiries yet</h3>
              <p>New public contact requests will appear here.</p>
            </article>
          ) : (
            enquiries.map((enquiry) => (
              <article key={enquiry.id} className="account-card">
                <div className="account-card__top">
                  <div>
                    <h3>{enquiry.name}</h3>
                    <p>{enquiry.email}</p>
                  </div>
                  <span
                    className={`fleet-status ${
                      enquiry.status === "reviewed"
                        ? "fleet-status--accepted"
                        : "fleet-status--pending"
                    }`}
                  >
                    {enquiry.status}
                  </span>
                </div>
                <div className="transaction-panel">
                  <div className="transaction-panel__head">
                    <h3>Message</h3>
                  </div>
                  <p className="account-copy">{enquiry.message}</p>
                </div>
                <div className="account-card__actions">
                  <form action={updateContactRequestStatusAction} className="admin-inline-form">
                    <input type="hidden" name="id" value={enquiry.id} />
                    <button
                      type="submit"
                      name="status"
                      value={enquiry.status === "new" ? "reviewed" : "new"}
                      className="site-nav__button"
                    >
                      {enquiry.status === "new" ? "Mark Reviewed" : "Reset To New"}
                    </button>
                  </form>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
