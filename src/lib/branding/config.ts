import type { BrandConfig } from "./types";

export const brands: Record<string, BrandConfig> = {
  thula: {
    slug: "thula",
    name: "THULA",
    tagline: "Electric Safari Vehicles",
    metaDescription:
      "A white-label marketplace and workflow platform, first configured for Thula electric safari vehicles.",
    contactEmail: "[email protected]",
    contactPhone: "+27 11 000 0000",
    contactAddress: "Pinmill Farm, Block C, 164 Katherine St, Barlow Park, Sandton, 2148",
    terminology: {
      assetSingular: "Vehicle",
      assetPlural: "Vehicles",
      marketplaceLabel: "Marketplace",
      sellerWorkspaceLabel: "My Fleet",
      offerLabel: "Offer",
    },
    theme: {
      primary: "#9a7b52",
      primaryDeep: "#1a1510",
      accent: "#c4a882",
      background: "#fdf6f0",
      forest: "#2d1f15",
    },
    navigation: [
      { href: "/esv", label: "ESV" },
      { href: "/boat", label: "eBoat" },
      { href: "/marketplace", label: "Marketplace" },
      { href: "/contact", label: "Contact" },
    ],
    hero: {
      eyebrow: "Electric Safari Vehicles",
      title: "EXPERIENCE\nNATURE LIKE\nNEVER BEFORE.",
      subtitle: "SILENT. SUSTAINABLE. UNFORGETTABLE.",
      primaryCta: "Explore ESV",
      secondaryCta: "Contact Thula",
    },
    home: {
      introCards: [
        {
          label: "Immersive exploration",
          title: "Electric safari vehicles designed for the bush",
          description:
            "Use the existing listing flow to showcase available vehicles, review specs, and manage reserve-based offers.",
        },
        {
          label: "Built for operators",
          title: "Fleet-ready sales workflow",
          description:
            "The core auction and admin structure remains, but the public story now centers on Thula's vehicle fleet.",
        },
      ],
      whyChoose: {
        eyebrow: "Why Choose Thula",
        title: "Immersive nature experiences tailored with guests in mind",
        paragraphs: [
          "Explore the African bush more quietly and more intentionally. Thula's electric safari vehicles are positioned around guest comfort, low-noise operation, and stronger wildlife encounters.",
          "The public side of this platform reflects that shift: vehicle-led messaging, sustainability-first copy, and a fleet showcase instead of aviation-led landing pages.",
        ],
        stats: [
          { value: "Quiet", label: "Low-noise guest drives" },
          { value: "Electric", label: "Reduced operational impact" },
          { value: "Fleet", label: "Structured operator sales flow" },
        ],
        visualTitle: "Built for lodges, reserves, and private operators",
        visualDescription:
          "Position the fleet around less intrusive encounters, stronger photography conditions, and a premium modern safari experience.",
        features: [
          {
            icon: "💧",
            title: "Silent and immersive exploration",
            description:
              "Our electric safari vehicles offer a unique way to experience the wildscape. Free from the noise and pollution of traditional engines, our vehicles allow you to fully immerse yourself in the natural sounds of the environment, enhancing your eco expeditions.",
          },
          {
            icon: "🐾",
            title: "Enhanced wildlife viewing",
            description:
              "Enjoy closer, less intrusive wildlife encounters with our quiet electric vehicles. Observe animals in their natural habitat without disturbing them, creating a more authentic and intimate experience.",
          },
          {
            icon: "🌿",
            title: "Commitment to sustainability",
            description:
              "By reducing our carbon footprint, we ensure a greener future while providing a reliable and efficient way to explore the bush — for operators, lodges, and reserves who want to lead the way.",
          },
        ],
      },
      featureStrip: [
        {
          index: "01",
          title: "Marketplace flow preserved",
          description:
            "Listings, reserve-led positioning, favourites, and offer progression stay aligned with the current build.",
        },
        {
          index: "02",
          title: "Operational admin parity",
          description:
            "Verification, internal approvals, invoicing, and document handling remain part of the product model.",
        },
        {
          index: "03",
          title: "White-label ready",
          description:
            "The app is being rebuilt so brand copy, imagery, terminology, and color systems can be swapped without rewriting platform logic.",
        },
      ],
      closingCta: {
        title: "Let's electrify your safari fleet",
        description:
          "Use the existing enquiry, sign-up, and listing flow to support lodge partnerships, fleet discussions, and guest-experience focused vehicle sales.",
        primaryLabel: "Explore Marketplace",
        secondaryLabel: "Contact Thula",
      },
    },
    fleet: {
      eyebrow: "Thula Marketplace",
      title: "Explore The Thula Marketplace",
      description:
        "Browse Thula-aligned game vehicle listings, compare reserve pricing, and use the existing offer workflow to manage serious buyer enquiries.",
      filters: [
        {
          title: "Availability",
          options: ["Under Offer", "Favourites"],
        },
        {
          title: "Vehicle Model",
          options: ["Thula ESV"],
        },
        {
          title: "Fleet Number",
          options: ["001-120", "121-240", "241-360"],
        },
        {
          title: "Reserve Price",
          options: ["R 1.5m - R 2m", "R 2m - R 2.5m", "R 2.5m+"],
        },
      ],
      listings: [
        {
          slug: "thula-esv-explorer-tx-145",
          model: "Thula ESV",
          code: "TX-145",
          reservePrice: "R 1 850 000",
          currentListPrice: "R 1 640 000",
          serialLabel: "",
          status: "open",
          verified: true,
          description: "",
          payableNowBase: 145000,
          serviceFeeRate: 0.05,
          imageUrls: [
            "https://thula.africa/images/img_esv_section02_01.jpg",
            "https://thula.africa/images/img_home_section02_01.jpg",
            "https://thula.africa/images/IMG_9769-1.jpg",
          ],
        },
        {
          slug: "thula-esv-safari-xl-tx-234",
          model: "Thula ESV",
          code: "TX-234",
          reservePrice: "R 2 240 000",
          currentListPrice: "R 2 020 000",
          serialLabel: "Fleet Range 210-234",
          status: "under-offer",
          verified: true,
          description:
            "Structured like the current under-offer marketplace cards so transaction state remains visible without changing the flow.",
          payableNowBase: 172000,
          serviceFeeRate: 0.05,
          imageUrls: [
            "https://thula.africa/images/IMG_9501.png",
            "https://thula.africa/images/img_esv_section02_01.jpg",
            "https://thula.africa/images/img_home_section02_01.jpg",
          ],
        },
        {
          slug: "thula-esv-reserve-pro-tx-327",
          model: "Thula ESV",
          code: "TX-327",
          reservePrice: "R 2 680 000",
          currentListPrice: "R 2 420 000",
          serialLabel: "Fleet Range 301-327",
          status: "open",
          verified: false,
          description:
            "The right-side price stack and action area are kept deliberately close to the existing listing composition.",
          payableNowBase: 198000,
          serviceFeeRate: 0.05,
          imageUrls: [
            "https://thula.africa/images/IMG_9769-1.jpg",
            "https://thula.africa/images/IMG_9501.png",
            "https://thula.africa/images/img_home_section02_01.jpg",
          ],
        },
      ],
    },
  },
};
