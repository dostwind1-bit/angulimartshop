export const SITE = {
  name: "AnguliMart",
  domain: "AnguliMart.shop",
  tagline: "Promote • Discover • Grow",
  owner: "Ankit Maurya",
  location: "Lucknow, Uttar Pradesh, India",
  whatsapp: "918957629511",
  affiliateDisclosure:
    "Some links on AnguliMart may be affiliate links. We may earn a commission when eligible purchases are made through these links, at no additional cost to you.",
};

export function whatsappLink(message: string, number: string = SITE.whatsapp) {
  const digits = number.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function formatPrice(value: number | null | undefined) {
  if (value === null || value === undefined) return null;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function discountPercent(
  price: number | null | undefined,
  original: number | null | undefined,
) {
  if (!price || !original || original <= price) return null;
  return Math.round(((original - price) / original) * 100);
}

export type LeadSourceInfo = {
  page_url: string;
  referrer: string | null;
  utm: Record<string, string>;
};

export function collectSourceInfo(): LeadSourceInfo {
  if (typeof window === "undefined") {
    return { page_url: "", referrer: null, utm: {} };
  }
  const params = new URLSearchParams(window.location.search);
  const utm: Record<string, string> = {};
  for (const key of [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_term",
    "utm_content",
    "ref",
  ]) {
    const value = params.get(key);
    if (value) utm[key] = value;
  }
  return {
    page_url: window.location.href,
    referrer: document.referrer || null,
    utm,
  };
}

export const PROMOTION_TYPES = [
  { value: "business", label: "Business Promotion" },
  { value: "product", label: "Product Promotion" },
  { value: "article", label: "Sponsored Article" },
  { value: "banner", label: "Banner Promotion" },
  { value: "featured", label: "Featured Promotion" },
] as const;

export function promotionTypeLabel(value: string) {
  return PROMOTION_TYPES.find((t) => t.value === value)?.label ?? value;
}
