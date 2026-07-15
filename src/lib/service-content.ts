import { ITEMS, PACKAGES, type Category, type PriceItem, type Unit } from "@/lib/pricing";

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };
type Metadata = { [key: string]: JsonValue };

export type PublicServiceContentItem = {
  id: string;
  contentKey: string | null;
  section: "services" | "pricing" | "build-your-package" | "packages";
  title: string;
  description: string;
  price: number | null;
  status: "active" | "draft";
  displayOrder: number;
  metadata?: Metadata;
};

export type ServiceCardContent = {
  id: string;
  icon: string;
  gradient: string;
  title: string;
  body: string;
  cta: string;
  bookingService: string;
  badge?: string;
};

export type PackageCardContent = {
  id: string;
  name: string;
  price: number;
  tagline: string;
  features: string[];
  gradient: string;
  popular: boolean;
};

const CATEGORIES: Category[] = [
  "Packages",
  "Risk Assessments",
  "Training",
  "Direct 365 Services",
  "RPA",
  "Resources",
];

const UNITS: Unit[] = ["each", "month", "year", "item", "service"];

function stringValue(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function booleanValue(value: unknown) {
  return value === true;
}

function numberValue(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function itemId(item: PublicServiceContentItem) {
  return stringValue(item.metadata?.itemId, item.contentKey ?? item.id);
}

function categoryValue(value: unknown): Category {
  return CATEGORIES.includes(value as Category) ? (value as Category) : "Resources";
}

function unitValue(value: unknown): Unit | undefined {
  return UNITS.includes(value as Unit) ? (value as Unit) : undefined;
}

export function toServiceCards(items: PublicServiceContentItem[]): ServiceCardContent[] {
  if (items.length === 0) {
    return [];
  }

  return items.map((item) => ({
    id: itemId(item),
    icon: stringValue(item.metadata?.icon, "FileCheck2"),
    gradient: stringValue(item.metadata?.gradient, "gradient-teal-purple"),
    title: item.title,
    body: item.description,
    cta: stringValue(item.metadata?.cta, "Book this service"),
    bookingService: stringValue(item.metadata?.bookingService, "other"),
    badge: stringValue(item.metadata?.badge) || undefined,
  }));
}

export function toPriceItems(
  items: PublicServiceContentItem[],
  fallback: PriceItem[] = ITEMS,
): PriceItem[] {
  if (items.length === 0) {
    return fallback;
  }

  return items.map((item) => ({
    id: itemId(item),
    name: item.title,
    category: categoryValue(item.metadata?.category),
    price: item.price ?? 0,
    priceLabel: stringValue(item.metadata?.priceLabel) || undefined,
    unit: unitValue(item.metadata?.unit),
    allowQuantity: booleanValue(item.metadata?.allowQuantity),
    defaultQty: numberValue(item.metadata?.defaultQty),
    exVat: booleanValue(item.metadata?.exVat),
    description: item.description || undefined,
    tbd: booleanValue(item.metadata?.tbd),
    tiered: booleanValue(item.metadata?.tiered),
  }));
}

export function toPackageCards(items: PublicServiceContentItem[]): PackageCardContent[] {
  if (items.length === 0) {
    return PACKAGES.map((item) => ({ ...item, features: [...item.features] }));
  }

  return items.map((item) => {
    const features = Array.isArray(item.metadata?.features)
      ? item.metadata.features.filter((feature): feature is string => typeof feature === "string")
      : [];

    return {
      id: itemId(item),
      name: item.title,
      price: item.price ?? 0,
      tagline: stringValue(item.metadata?.tagline, item.description),
      features,
      gradient: stringValue(item.metadata?.gradient, "gradient-teal-purple"),
      popular: booleanValue(item.metadata?.popular),
    };
  });
}
