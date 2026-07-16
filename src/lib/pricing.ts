// Central pricing — edit prices here. [PRICE] = fill in later.
export type Unit = "each" | "month" | "year" | "item" | "service";

export type PriceItem = {
  id: string;
  name: string;
  category: Category;
  price: number; // GBP, 0 if [PRICE]
  priceLabel?: string; // optional override e.g. "£30/mo"
  unit?: Unit;
  allowQuantity?: boolean;
  defaultQty?: number;
  exVat?: boolean; // Direct 365 items shown +VAT
  description?: string;
  tbd?: boolean; // unknown price
  tiered?: boolean;
};

export type Category = string;

export const DEFAULT_CATEGORIES: Category[] = [
  "Packages",
  "Risk Assessments",
  "Training",
  "Direct 365 Services",
  "RPA",
  "Resources",
];

export const PACKAGES = [
  {
    id: "pkg-essential",
    name: "Essential Compliance Package",
    price: 199,
    tagline: "Meet your fundamental safety and compliance requirements.",
    features: [
      "Fire, Legionella, Health & Safety, Disability Risk Assessments",
      "PAT Testing",
      "Emergency Lighting",
      "Fire Extinguisher Service",
      "Autoclave PVI Testing",
      "Compressor PVI Testing",
    ],
    gradient: "gradient-blue-teal",
    popular: false,
  },
  {
    id: "pkg-safety",
    name: "Safety & Training Package",
    price: 299,
    tagline: "Prioritise staff training and equipment safety.",
    features: [
      "Fire, Legionella, Health & Safety, Disability Risk Assessments",
      "PAT Testing",
      "Emergency Lighting",
      "Fire Extinguisher Service",
      "Autoclave PVI Testing",
      "Compressor PVI Testing",
      "Cross Infection Training",
      "Medical Emergency & BLS Training",
    ],
    gradient: "gradient-teal-purple",
    popular: true,
  },
  {
    id: "pkg-complete",
    name: "Complete Compliance & Safety Package",
    price: 399,
    tagline: "Our full-service solution for total workplace safety.",
    features: [
      "Fire, Legionella, Health & Safety, Disability Risk Assessments",
      "PAT Testing",
      "Emergency Lighting",
      "Fire Extinguisher Service",
      "Autoclave PVI Testing",
      "Compressor PVI Testing",
      "RPA Service",
      "Annual Mock Inspection",
    ],
    gradient: "gradient-purple-orange",
    popular: false,
  },
] as const;

export const COMPARISON_ROWS: { label: string; pkgs: [boolean, boolean, boolean] }[] = [
  { label: "Fire, Legionella, H&S, Disability Risk Assessments", pkgs: [true, true, true] },
  { label: "PAT Testing", pkgs: [true, true, true] },
  { label: "Emergency Lighting", pkgs: [true, true, true] },
  { label: "Fire Extinguisher Service", pkgs: [true, true, true] },
  { label: "Autoclave & Compressor PVI Testing", pkgs: [true, true, true] },
  { label: "Cross Infection Training", pkgs: [false, true, true] },
  { label: "Medical Emergency & BLS Training", pkgs: [false, true, true] },
  { label: "RPA Service", pkgs: [false, false, true] },
  { label: "Annual Mock Inspection", pkgs: [false, false, true] },
];

export const ITEMS: PriceItem[] = [
  // Packages
  { id: "pkg-essential", name: "Essential Compliance Package", category: "Packages", price: 199 },
  { id: "pkg-safety", name: "Safety & Training Package", category: "Packages", price: 299 },
  {
    id: "pkg-complete",
    name: "Complete Compliance & Safety Package",
    category: "Packages",
    price: 399,
  },

  // Risk Assessments
  {
    id: "ra-bundle",
    name: "4× Risk Assessments (Bundle)",
    category: "Risk Assessments",
    price: 1200,
    description: "Fire, Legionella, H&S, Disability",
  },
  { id: "ra-fire", name: "Fire Risk Assessment", category: "Risk Assessments", price: 350 },
  {
    id: "ra-legionella",
    name: "Legionella Risk Assessment",
    category: "Risk Assessments",
    price: 350,
  },
  {
    id: "ra-hs",
    name: "Health & Safety Risk Assessment",
    category: "Risk Assessments",
    price: 350,
  },
  {
    id: "ra-disability",
    name: "Disability Access Assessment",
    category: "Risk Assessments",
    price: 350,
  },

  // Training
  { id: "tr-bls", name: "Basic Life Support (BLS)", category: "Training", price: 499 },
  { id: "tr-ils", name: "Immediate Life Support (ILS)", category: "Training", price: 750 },
  { id: "tr-complaints", name: "Complaints Handling", category: "Training", price: 399 },
  { id: "tr-ci-house", name: "Cross Infection (in house)", category: "Training", price: 399 },
  { id: "tr-ci-online", name: "Cross Infection (online)", category: "Training", price: 350 },
  { id: "tr-safeguarding", name: "Safeguarding Level 1 & 2", category: "Training", price: 399 },

  // Direct 365 Services (+VAT)
  {
    id: "d365-emlights",
    name: "Emergency Lights — up to 20",
    category: "Direct 365 Services",
    price: 95,
    exVat: true,
  },
  {
    id: "d365-emlights-extra",
    name: "Additional Emergency Light test",
    category: "Direct 365 Services",
    price: 4.95,
    exVat: true,
    allowQuantity: true,
    unit: "each",
  },
  {
    id: "d365-extinguishers",
    name: "Fire Extinguishers — 10 serviced",
    category: "Direct 365 Services",
    price: 67,
    exVat: true,
  },
  {
    id: "d365-extinguishers-extra",
    name: "Additional Extinguisher service",
    category: "Direct 365 Services",
    price: 3.95,
    exVat: true,
    allowQuantity: true,
    unit: "each",
  },
  {
    id: "d365-firealarm",
    name: "Fire Alarm Servicing — up to 20 devices",
    category: "Direct 365 Services",
    price: 165,
    exVat: true,
  },
  {
    id: "d365-firealarm-extra",
    name: "Additional Fire Alarm device test",
    category: "Direct 365 Services",
    price: 8,
    exVat: true,
    allowQuantity: true,
    unit: "each",
  },
  {
    id: "d365-pat",
    name: "PAT Testing (qty)",
    category: "Direct 365 Services",
    price: 1.88,
    exVat: true,
    allowQuantity: true,
    unit: "item",
    tiered: true,
    description: "£1.88/item up to 40, then £0.80/item",
  },
  {
    id: "d365-inspection",
    name: "Independent Inspection",
    category: "Direct 365 Services",
    price: 0,
    tbd: true,
    exVat: true,
  },
  {
    id: "d365-pvi",
    name: "PVI — 1× Autoclave & 1× Compressor",
    category: "Direct 365 Services",
    price: 268.8,
    exVat: true,
  },

  // RPA
  {
    id: "rpa-month",
    name: "Complete RPA Service — Monthly",
    category: "RPA",
    price: 30,
    unit: "month",
    priceLabel: "£30/mo",
  },
  {
    id: "rpa-year",
    name: "Complete RPA Service — Annual",
    category: "RPA",
    price: 360,
    unit: "year",
    priceLabel: "£360/yr",
  },

  // Resources
  {
    id: "log-reception",
    name: "Reception Logbook",
    category: "Resources",
    price: 49.99,
    allowQuantity: true,
  },
  {
    id: "log-nurse",
    name: "Dental Nurse Logbook",
    category: "Resources",
    price: 49.99,
    allowQuantity: true,
  },
  {
    id: "log-lead-nurse",
    name: "Lead Nurse Logbook",
    category: "Resources",
    price: 49.99,
    allowQuantity: true,
  },
  {
    id: "log-manager",
    name: "Practice Manager Logbook",
    category: "Resources",
    price: 49.99,
    allowQuantity: true,
  },
];

// PAT tiered pricing helper
export function patPrice(qty: number): number {
  if (qty <= 0) return 0;
  if (qty <= 40) return qty * 1.88;
  return 40 * 1.88 + (qty - 40) * 0.8;
}

export function formatGBP(n: number): string {
  return new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(n);
}
