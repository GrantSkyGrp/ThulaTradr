import Link from "next/link";
import { updateLeadRequestStatusAction } from "@/app/actions";
import { requireAdmin } from "@/lib/auth";
import { getAllLeadRequests } from "@/lib/local-db";

export default async function AdminLeadsPage() {
  await requireAdmin();
  const leads = await getAllLeadRequests();

  return (
    <main className="admin-shell">
      <div className="container-shell">
        <div className="admin-header">
          <div className="thula-kicker">Admin Leads</div>
          <h1 className="admin-title">Demo, bespoke, and newsletter inbox</h1>
          <p className="admin-copy">
            This combines the non-marketplace lead queues into a single admin review surface.
          </p>
        </div>

        <div className="admin-toolbar">
          <Link href="/admin" className="site-nav__button">
            Overview
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
        </div>

        <div className="account-list">
          {leads.length === 0 ? (
            <article className="account-card">
              <h3>No leads yet</h3>
              <p>Demo, bespoke, and newsletter requests will appear here.</p>
            </article>
          ) : (
            leads.map((lead) => (
              <article key={lead.id} className="account-card">
                <div className="account-card__top">
                  <div>
                    <h3>{lead.name}</h3>
                    <p>{lead.email}</p>
                  </div>
                  <span
                    className={`fleet-status ${
                      lead.status === "reviewed"
                        ? "fleet-status--accepted"
                        : "fleet-status--pending"
                    }`}
                  >
                    {lead.type} / {lead.status}
                  </span>
                </div>

                <div className="transaction-panel">
                  <div className="transaction-panel__head">
                    <h3>Lead note</h3>
                  </div>
                  <p className="account-copy">{lead.note}</p>
                </div>

                <div className="account-card__actions">
                  <form action={updateLeadRequestStatusAction} className="admin-inline-form">
                    <input type="hidden" name="id" value={lead.id} />
                    <button
                      type="submit"
                      name="status"
                      value={lead.status === "new" ? "reviewed" : "new"}
                      className="site-nav__button"
                    >
                      {lead.status === "new" ? "Mark Reviewed" : "Reset To New"}
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
