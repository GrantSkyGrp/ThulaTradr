export type TerminologyPack = {
  assetSingular: string;
  assetPlural: string;
  marketplaceLabel: string;
  sellerWorkspaceLabel: string;
  offerLabel: string;
};

export type BrandTheme = {
  primary: string;
  primaryDeep: string;
  accent: string;
  background: string;
  forest: string;
};

export type BrandConfig = {
  slug: string;
  name: string;
  tagline: string;
  metaDescription: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  terminology: TerminologyPack;
  theme: BrandTheme;
  navigation: Array<{
    href: string;
    label: string;
  }>;
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    primaryCta: string;
    secondaryCta: string;
  };
  home: {
    introCards: Array<{
      label: string;
      title: string;
      description: string;
    }>;
    whyChoose: {
      eyebrow: string;
      title: string;
      paragraphs: string[];
      stats: Array<{
        value: string;
        label: string;
      }>;
      visualTitle: string;
      visualDescription: string;
      features: Array<{
        icon: string;
        title: string;
        description: string;
      }>;
    };
    featureStrip: Array<{
      index: string;
      title: string;
      description: string;
    }>;
    closingCta: {
      title: string;
      description: string;
      primaryLabel: string;
      secondaryLabel: string;
    };
  };
  fleet: {
    eyebrow: string;
    title: string;
    description: string;
    filters: Array<{
      title: string;
      options: string[];
    }>;
    listings: Array<{
      slug: string;
      model: string;
      code: string;
      reservePrice: string;
      currentListPrice: string;
      serialLabel: string;
      status: "open" | "under-offer";
      verified: boolean;
      description: string;
      payableNowBase: number;
      serviceFeeRate: number;
      imageUrls: string[];
    }>;
  };
};
