import { OffersList, type OfferListItem } from "@/components/account/offers-list";
import { requireUser } from "@/lib/auth";
import {
  ensureTransactionForAcceptedOffer,
  getListingBySlug,
  getOffersByUserId,
  getTransactionsByUserId,
  type LocalOfferRecord,
} from "@/lib/local-db";

export default async function AccountOffersPage() {
  const user = await requireUser();
  const offers = await getOffersByUserId(user.id);

  await Promise.all(
    offers
      .filter((offer: LocalOfferRecord) => offer.status === "accepted")
      .map(async (offer: LocalOfferRecord) => ensureTransactionForAcceptedOffer(offer.id)),
  );

  const transactions = await getTransactionsByUserId(user.id);
  const offerItems: OfferListItem[] = await Promise.all(
    offers.map(async (offer: LocalOfferRecord) => {
      const listing = await getListingBySlug(offer.listingSlug);
      const transaction = transactions.find((entry) => entry.offerId === offer.id) ?? null;

      return {
        id: offer.id,
        listingSlug: offer.listingSlug,
        listingModel: offer.listingModel,
        listingCode: listing?.code ?? null,
        serialLabel: listing?.serialLabel ?? null,
        imageUrl: listing?.imageUrls[0] ?? null,
        amount: offer.amount,
        currentListPrice: offer.currentListPrice,
        createdAt: offer.createdAt,
        status: offer.status,
        transactionId: transaction?.id ?? null,
        transactionStatus: transaction?.status ?? null,
        ownershipTransferredAt: transaction?.ownershipTransferredAt ?? null,
      };
    }),
  );

  return (
    <main className="account-shell">
      <div className="container-shell">
        <OffersList offers={offerItems} />
      </div>
    </main>
  );
}
