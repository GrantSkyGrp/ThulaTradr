import { getAllListings, getListingBySlug } from "@/lib/local-db";

export async function getFleetListings() {
  return getAllListings().catch(() => []);
}

export async function getFleetListingBySlug(slug: string) {
  return getListingBySlug(slug).catch(() => null);
}
