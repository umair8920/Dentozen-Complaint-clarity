import {
  COMPARISON_ROWS,
  DEFAULT_CATEGORIES,
  ITEMS,
  PACKAGES,
  type Category,
  type PriceItem,
  type Unit,
} from "@/lib/pricing";

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };
type Metadata = { [key: string]: JsonValue };

export type PublicServiceContentItem = {
  id: string;
  contentKey: string | null;
  section: "pricing" | "build-your-package" | "packages" | "package-comparison";
  title: string;
  description: string;
  price: number | null;
  status: "active" | "draft";
  displayOrder: number;
  metadata?: Metadata;
};

export type PublicServiceCategory = {
  id: string;
  name: string;
  displayOrder: number;
  pricingNote: string;
  builderNote: string;
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

export type PackageComparisonRow = {
  id: string;
  label: string;
  includedPackageIds: string[];
};

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
  return typeof value === "string" && value.trim() ? value : "Resources";
}

function unitValue(value: unknown): Unit | undefined {
  return UNITS.includes(value as Unit) ? (value as Unit) : undefined;
}

export function categoryNames(
  categories: PublicServiceCategory[] | undefined,
  items: PriceItem[],
  includePackages = false,
): Category[] {
  const fromRecords = (categories ?? []).map((category) => category.name).filter(Boolean);
  const fromItems = items.map((item) => item.category).filter(Boolean);
  const ordered = [...fromRecords, ...DEFAULT_CATEGORIES, ...fromItems];
  const unique = ordered.filter((category, index) => ordered.indexOf(category) === index);

  return unique.filter(
    (category) =>
      (includePackages || category !== "Packages") &&
      items.some((item) => item.category === category),
  );
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

export function toPackageComparisonRows(
  items: PublicServiceContentItem[],
  packageIds: string[],
): PackageComparisonRow[] {
  if (items.length === 0) {
    return COMPARISON_ROWS.map((row, rowIndex) => ({
      id: `comparison-${rowIndex}`,
      label: row.label,
      includedPackageIds: packageIds.filter((_, packageIndex) => row.pkgs[packageIndex]),
    }));
  }

  return items.map((item) => ({
    id: itemId(item),
    label: item.title,
    includedPackageIds: Array.isArray(item.metadata?.includedPackageIds)
      ? item.metadata.includedPackageIds.filter(
          (packageId): packageId is string => typeof packageId === "string",
        )
      : [],
  }));
}
