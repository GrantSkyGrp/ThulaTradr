import { getAllListings, getListingBySlug } from "@/lib/local-db";

export async function getFleetListings() {
  return getAllListings();
}

export async function getFleetListingBySlug(slug: string) {
  return getListingBySlug(slug);
}
