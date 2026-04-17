import Link from "next/link";
import type { LocalActivityRecord } from "@/lib/local-db";

function formatTimestamp(value: string) {
  return new Intl.DateTimeFormat("en-ZA", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

type ActivityFeedProps = {
  title: string;
  copy: string;
  items: LocalActivityRecord[];
  emptyLabel: string;
  backHref?: string;
  backLabel?: string;
};

export function ActivityFeed({
  title,
  copy,
  items,
  emptyLabel,
  backHref,
  backLabel,
}: ActivityFeedProps) {
  return (
    <main className="account-shell">
      <div className="container-shell">
        {backHref && backLabel ? (
          <div className="admin-toolbar">
            <Link href={backHref} className="site-nav__button">
              {backLabel}
            </Link>
          </div>
        ) : null}

        <div className="account-header">
          <div className="thula-kicker">Workflow Activity</div>
          <h1 className="account-title">{title}</h1>
          <p className="account-copy">{copy}</p>
        </div>

        <section className="account-card">
          <div className="activity-timeline">
            {items.length === 0 ? (
              <div className="activity-item">
                <strong>{emptyLabel}</strong>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="activity-item">
                  <div className="activity-item__meta">
                    <span>{item.actorRole}</span>
                    <span>{formatTimestamp(item.createdAt)}</span>
                  </div>
                  <strong>{item.message}</strong>
                  <p>{item.eventType}</p>
                  {item.transactionId ? (
                    <span className="activity-item__ref">Transaction {item.transactionId}</span>
                  ) : null}
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
