import { ActivityFeed } from "@/components/activity/activity-feed";
import { requireUser } from "@/lib/auth";
import { getActivityByUserId } from "@/lib/local-db";

export default async function AccountNotificationsPage() {
  const user = await requireUser();
  const items = await getActivityByUserId(user.id);

  return (
    <ActivityFeed
      title="Buyer activity feed"
      copy="This keeps the accepted-offer and transaction progression visible as a simple event stream."
      items={items}
      emptyLabel="No buyer activity yet."
      backHref="/account/transactions"
      backLabel="Back to Transactions"
    />
  );
}
