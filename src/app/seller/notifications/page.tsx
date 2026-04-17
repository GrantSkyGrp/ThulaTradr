import { ActivityFeed } from "@/components/activity/activity-feed";
import { requireSeller } from "@/lib/auth";
import { getActivityByUserId } from "@/lib/local-db";

export default async function SellerNotificationsPage() {
  const seller = await requireSeller();
  const items = await getActivityByUserId(seller.id);

  return (
    <ActivityFeed
      title="Seller activity feed"
      copy="Seller-side deal movement stays visible here as the same transaction workflow progresses."
      items={items}
      emptyLabel="No seller activity yet."
      backHref="/seller/transactions"
      backLabel="Back to Seller Transactions"
    />
  );
}
