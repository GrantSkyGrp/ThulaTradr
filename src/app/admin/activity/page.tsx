import { ActivityFeed } from "@/components/activity/activity-feed";
import { requireAdmin } from "@/lib/auth";
import { getRecentActivity } from "@/lib/local-db";

export default async function AdminActivityPage() {
  await requireAdmin();
  const items = await getRecentActivity();

  return (
    <ActivityFeed
      title="Admin workflow activity"
      copy="This is the cross-platform event view for offers, transactions, invoice changes, and document handling."
      items={items}
      emptyLabel="No admin activity yet."
      backHref="/admin/transactions"
      backLabel="Back to Transactions"
    />
  );
}
