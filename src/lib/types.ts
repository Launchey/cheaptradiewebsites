export interface BuilderState {
  step: 1 | 2 | 3 | 4;
  referenceUrl: string;
  existingWebsiteUrl?: string;
  businessInfo: BusinessInfo;
  designTokens?: ExtractedDesignTokens;
  extractedImages?: ExtractedImage[];
  generatedHtml?: string;
  siteId?: string;
  previewUrl?: string;
  paymentComplete?: boolean;
  isLoading?: boolean;
  error?: string;
}

export interface BusinessInfo {
  businessName: string;
  tradeType: TradeType;
  location: string;
  region: string;
  phone: string;
  email: string;
  services: string[];
  aboutText: string;
  tagline?: string;
  yearsExperience?: number;
}

export type TradeType =
  | "builder"
  | "electrician"
  | "plumber"
  | "drainlayer"
  | "painter"
  | "roofer"
  | "landscaper"
  | "concrete"
  | "fencer"
  | "tiler"
  | "gasfitter"
  | "plasterer"
  | "demolition"
  | "earthworks"
  | "other";

export interface ExtractedDesignTokens {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  fonts: { heading: string; body: string };
  style: "minimal" | "bold" | "warm" | "dark" | "corporate" | "rustic";
  layoutPatterns: string[];
}

export interface ExtractedImage {
  src: string;
  alt: string;
  type: "logo" | "hero" | "gallery" | "team" | "other";
  base64?: string;
}

export interface GeneratedSite {
  id: string;
  html: string;
  businessInfo: BusinessInfo;
  designTokens: ExtractedDesignTokens;
  createdAt: string;
  status: "preview" | "paid" | "deployed";
  deployedUrl?: string;
}
