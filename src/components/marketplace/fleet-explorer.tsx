"use client";

import { useMemo, useState } from "react";
import { FleetFilters } from "@/components/marketplace/fleet-filters";
import { FleetListings } from "@/components/marketplace/fleet-listings";
import { parseCurrency } from "@/lib/marketplace/format";

type FleetFilterGroup = {
  title: string;
  options: string[];
};

type FleetListing = {
  slug: string;
  model: string;
  code: string;
  reservePrice: string;
  currentListPrice: string;
  serialLabel: string;
  status: "open" | "under-offer";
  verified: boolean;
  description: string;
};

type FleetExplorerProps = {
  filters: FleetFilterGroup[];
  listings: FleetListing[];
};

type SortOption =
  | "featured"
  | "price-asc"
  | "price-desc"
  | "reserve-asc"
  | "reserve-desc"
  | "model-asc"
  | "model-desc";

function matchesFleetRange(serialLabel: string, option: string) {
  if (option === "001-120") {
    return /120-145/.test(serialLabel);
  }

  if (option === "121-240") {
    return /210-234/.test(serialLabel);
  }

  if (option === "241-360") {
    return /301-327/.test(serialLabel);
  }

  return true;
}

function matchesReserveRange(reservePrice: string, option: string) {
  const amount = parseCurrency(reservePrice);

  if (option === "R 1.5m - R 2m") {
    return amount >= 1500000 && amount <= 2000000;
  }

  if (option === "R 2m - R 2.5m") {
    return amount > 2000000 && amount <= 2500000;
  }

  if (option === "R 2.5m+") {
    return amount > 2500000;
  }

  return true;
}

export function FleetExplorer({ filters, listings }: FleetExplorerProps) {
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const [sort, setSort] = useState<SortOption>("featured");
  const [favourites, setFavourites] = useState<string[]>([]);

  function toggleFilter(groupTitle: string, option: string) {
    setSelectedFilters((current) => {
      const existing = current[groupTitle] ?? [];
      const nextValues = existing.includes(option)
        ? existing.filter((value) => value !== option)
        : [...existing, option];

      return {
        ...current,
        [groupTitle]: nextValues,
      };
    });
  }

  function resetFilters() {
    setSelectedFilters({});
    setSort("featured");
  }

  function toggleFavourite(slug: string) {
    setFavourites((current) =>
      current.includes(slug)
        ? current.filter((value) => value !== slug)
        : [...current, slug],
    );
  }

  const filteredListings = useMemo(() => {
    const availability = selectedFilters.Availability ?? [];
    const models = selectedFilters["Vehicle Model"] ?? [];
    const fleetNumbers = selectedFilters["Fleet Number"] ?? [];
    const reserveRanges = selectedFilters["Reserve Price"] ?? [];

    const next = listings.filter((listing) => {
      if (
        availability.length > 0 &&
        !availability.some((option) => {
          if (option === "Under Offer") {
            return listing.status === "under-offer";
          }

          if (option === "Favourites") {
            return favourites.includes(listing.slug);
          }

          return true;
        })
      ) {
        return false;
      }

      if (models.length > 0 && !models.some((option) => listing.model.includes(option))) {
        return false;
      }

      if (
        fleetNumbers.length > 0 &&
        !fleetNumbers.some((option) => matchesFleetRange(listing.serialLabel, option))
      ) {
        return false;
      }

      if (
        reserveRanges.length > 0 &&
        !reserveRanges.some((option) => matchesReserveRange(listing.reservePrice, option))
      ) {
        return false;
      }

      return true;
    });

    return [...next].sort((a, b) => {
      switch (sort) {
        case "price-asc":
          return parseCurrency(a.currentListPrice) - parseCurrency(b.currentListPrice);
        case "price-desc":
          return parseCurrency(b.currentListPrice) - parseCurrency(a.currentListPrice);
        case "reserve-asc":
          return parseCurrency(a.reservePrice) - parseCurrency(b.reservePrice);
        case "reserve-desc":
          return parseCurrency(b.reservePrice) - parseCurrency(a.reservePrice);
        case "model-asc":
          return a.model.localeCompare(b.model);
        case "model-desc":
          return b.model.localeCompare(a.model);
        default:
          return 0;
      }
    });
  }, [favourites, listings, selectedFilters, sort]);

  return (
    <div className="fleet-panel">
      <FleetFilters
        filters={filters}
        selectedFilters={selectedFilters}
        onToggleFilter={toggleFilter}
        onResetFilters={resetFilters}
      />
      <FleetListings
        listings={filteredListings}
        sort={sort}
        onSortChange={setSort}
        favourites={favourites}
        onToggleFavourite={toggleFavourite}
      />
    </div>
  );
}
