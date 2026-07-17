import type { PendingBookingSelection } from "@/lib/api/user-bookings.functions";

const CART_KEY = "cc_booking_cart_v2";
const CHECKOUT_DRAFT_KEY = "cc_booking_checkout_draft_v2";
const CHECKOUT_PROGRESS_KEY = "cc_booking_checkout_progress_v2";
const AUTH_RETURN_KEY = "cc_auth_return_path";
const LEGACY_SELECTION_KEY = "cc_pending_booking_selection";
const CART_EVENT = "cc-booking-cart-change";

export type BookingCartItem = PendingBookingSelection & {
  id: string;
  unitPrice: number | null;
  vatAmount: number;
  quantity: number;
  addedAt: string;
};

export type BookingCheckoutDraft = {
  contactName: string;
  contactEmail: string;
  telephone: string;
  contactRole: string;
  practiceName: string;
  practiceType: string;
  practiceNation: string;
  addressLine1: string;
  addressLine2: string;
  townCity: string;
  county: string;
  postcode: string;
  firstDate: string;
  secondDate: string;
  thirdDate: string;
  bookingTime: string;
  delegates: string;
  teamSize: string;
  deliveryMode: string;
  equipmentSummary: string;
  xrayEquipmentCount: string;
  currentRpaExpiry: string;
  deliveryName: string;
  deliveryAddressLine1: string;
  deliveryAddressLine2: string;
  deliveryTownCity: string;
  deliveryCounty: string;
  deliveryPostcode: string;
  accessNotes: string;
  accessibilityNeeds: string;
  additionalNotes: string;
  privacyAccepted: boolean;
};

export const EMPTY_CHECKOUT_DRAFT: BookingCheckoutDraft = {
  contactName: "",
  contactEmail: "",
  telephone: "",
  contactRole: "",
  practiceName: "",
  practiceType: "",
  practiceNation: "",
  addressLine1: "",
  addressLine2: "",
  townCity: "",
  county: "",
  postcode: "",
  firstDate: "",
  secondDate: "",
  thirdDate: "",
  bookingTime: "",
  delegates: "",
  teamSize: "",
  deliveryMode: "",
  equipmentSummary: "",
  xrayEquipmentCount: "",
  currentRpaExpiry: "",
  deliveryName: "",
  deliveryAddressLine1: "",
  deliveryAddressLine2: "",
  deliveryTownCity: "",
  deliveryCounty: "",
  deliveryPostcode: "",
  accessNotes: "",
  accessibilityNeeds: "",
  additionalNotes: "",
  privacyAccepted: false,
};

function isBrowser() {
  return typeof window !== "undefined";
}

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `cart-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function announceCartChange() {
  if (isBrowser()) {
    window.dispatchEvent(new CustomEvent(CART_EVENT));
  }
}

function normalizeCartItem(value: unknown): BookingCartItem | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const item = value as Partial<BookingCartItem>;
  if (!item.serviceKey || !item.serviceLabel) {
    return null;
  }

  const serviceKey = String(item.serviceKey);
  const serviceSource = String(item.serviceSource || "direct");
  const allowsQuantity =
    serviceSource === "resources" || serviceKey === "d365-pat" || serviceKey.endsWith("-extra");

  return {
    id: typeof item.id === "string" && item.id ? item.id : createId(),
    serviceKey,
    serviceLabel: String(item.serviceLabel),
    serviceSource,
    paymentLink: String(item.paymentLink || "/book"),
    packageSelection: String(item.packageSelection || ""),
    packageSummary: String(item.packageSummary || ""),
    unitPrice:
      typeof item.unitPrice === "number" && Number.isFinite(item.unitPrice) ? item.unitPrice : null,
    vatAmount:
      typeof item.vatAmount === "number" && Number.isFinite(item.vatAmount) ? item.vatAmount : 0,
    quantity:
      allowsQuantity && typeof item.quantity === "number" && Number.isFinite(item.quantity)
        ? Math.max(1, Math.floor(item.quantity))
        : 1,
    addedAt: typeof item.addedAt === "string" ? item.addedAt : new Date().toISOString(),
  };
}

function migrateLegacySelection() {
  if (!isBrowser() || window.localStorage.getItem(CART_KEY)) {
    return;
  }

  const legacy = window.localStorage.getItem(LEGACY_SELECTION_KEY);
  if (!legacy) {
    return;
  }

  try {
    const selection = JSON.parse(legacy) as PendingBookingSelection;
    const item = normalizeCartItem({
      ...selection,
      id: createId(),
      unitPrice: null,
      vatAmount: 0,
      quantity: 1,
      addedAt: new Date().toISOString(),
    });
    if (item) {
      window.localStorage.setItem(CART_KEY, JSON.stringify([item]));
    }
  } catch {
    // A malformed legacy selection should not prevent the new cart from loading.
  } finally {
    window.localStorage.removeItem(LEGACY_SELECTION_KEY);
  }
}

export function loadBookingCart(): BookingCartItem[] {
  if (!isBrowser()) {
    return [];
  }

  migrateLegacySelection();
  const raw = window.localStorage.getItem(CART_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      throw new Error("Invalid cart");
    }
    return parsed.map(normalizeCartItem).filter((item): item is BookingCartItem => Boolean(item));
  } catch {
    window.localStorage.removeItem(CART_KEY);
    return [];
  }
}

function saveBookingCart(items: BookingCartItem[]) {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(CART_KEY, JSON.stringify(items));
  announceCartChange();
}

function sameSelection(a: BookingCartItem, b: Omit<BookingCartItem, "id" | "addedAt">) {
  return (
    a.serviceKey === b.serviceKey &&
    a.serviceSource === b.serviceSource &&
    a.packageSelection === b.packageSelection
  );
}

export function addBookingCartItem(
  input: Omit<BookingCartItem, "id" | "addedAt">,
  options: { incrementExisting?: boolean } = {},
) {
  const items = loadBookingCart();
  const existingIndex = items.findIndex((item) => sameSelection(item, input));

  if (existingIndex >= 0) {
    if (!options.incrementExisting) {
      return { item: items[existingIndex], added: false };
    }

    const current = items[existingIndex];
    const updated = {
      ...current,
      quantity: current.quantity + Math.max(1, input.quantity),
      addedAt: new Date().toISOString(),
    };
    items[existingIndex] = updated;
    saveBookingCart(items);
    return { item: updated, added: true };
  }

  const item: BookingCartItem = {
    ...input,
    id: createId(),
    quantity: Math.max(1, input.quantity),
    addedAt: new Date().toISOString(),
  };
  saveBookingCart([...items, item]);
  return { item, added: true };
}

export function updateBookingCartQuantity(id: string, quantity: number) {
  const nextQuantity = Math.max(0, Math.floor(quantity));
  if (nextQuantity === 0) {
    removeBookingCartItem(id);
    return;
  }

  saveBookingCart(
    loadBookingCart().map((item) => (item.id === id ? { ...item, quantity: nextQuantity } : item)),
  );
}

export function removeBookingCartItem(id: string) {
  saveBookingCart(loadBookingCart().filter((item) => item.id !== id));
  const progress = loadCheckoutProgress();
  if (progress[id]) {
    delete progress[id];
    saveCheckoutProgress(progress);
  }
}

export function clearBookingCart() {
  if (!isBrowser()) {
    return;
  }
  window.localStorage.removeItem(CART_KEY);
  window.localStorage.removeItem(CHECKOUT_PROGRESS_KEY);
  announceCartChange();
}

export function bookingCartCount(items = loadBookingCart()) {
  return items.reduce((total, item) => total + item.quantity, 0);
}

export function bookingCartTotals(items = loadBookingCart()) {
  return items.reduce(
    (totals, item) => {
      if (item.unitPrice === null) {
        totals.hasQuoteOnlyItem = true;
        return totals;
      }
      totals.subtotal += item.unitPrice * item.quantity;
      totals.vat += item.vatAmount * item.quantity;
      return totals;
    },
    { subtotal: 0, vat: 0, hasQuoteOnlyItem: false },
  );
}

export function subscribeToBookingCart(listener: () => void) {
  if (!isBrowser()) {
    return () => undefined;
  }

  const onStorage = (event: StorageEvent) => {
    if (event.key === CART_KEY) {
      listener();
    }
  };
  window.addEventListener(CART_EVENT, listener);
  window.addEventListener("storage", onStorage);

  return () => {
    window.removeEventListener(CART_EVENT, listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function loadCheckoutDraft(): BookingCheckoutDraft {
  if (!isBrowser()) {
    return EMPTY_CHECKOUT_DRAFT;
  }

  const raw = window.localStorage.getItem(CHECKOUT_DRAFT_KEY);
  if (!raw) {
    return EMPTY_CHECKOUT_DRAFT;
  }

  try {
    return { ...EMPTY_CHECKOUT_DRAFT, ...(JSON.parse(raw) as Partial<BookingCheckoutDraft>) };
  } catch {
    window.localStorage.removeItem(CHECKOUT_DRAFT_KEY);
    return EMPTY_CHECKOUT_DRAFT;
  }
}

export function saveCheckoutDraft(draft: BookingCheckoutDraft) {
  if (isBrowser()) {
    window.localStorage.setItem(CHECKOUT_DRAFT_KEY, JSON.stringify(draft));
  }
}

export function clearCheckoutDraft() {
  if (isBrowser()) {
    window.localStorage.removeItem(CHECKOUT_DRAFT_KEY);
  }
}

export function loadCheckoutProgress(): Record<string, string> {
  if (!isBrowser()) {
    return {};
  }

  try {
    return JSON.parse(window.localStorage.getItem(CHECKOUT_PROGRESS_KEY) || "{}") as Record<
      string,
      string
    >;
  } catch {
    window.localStorage.removeItem(CHECKOUT_PROGRESS_KEY);
    return {};
  }
}

export function saveCheckoutProgress(progress: Record<string, string>) {
  if (isBrowser()) {
    window.localStorage.setItem(CHECKOUT_PROGRESS_KEY, JSON.stringify(progress));
  }
}

export function saveAuthReturnPath(path: string) {
  if (isBrowser()) {
    window.localStorage.setItem(AUTH_RETURN_KEY, safeLocalPath(path));
  }
}

export function consumeAuthReturnPath(fallback = "/dashboard") {
  if (!isBrowser()) {
    return fallback;
  }

  const value = safeLocalPath(window.localStorage.getItem(AUTH_RETURN_KEY) || fallback);
  window.localStorage.removeItem(AUTH_RETURN_KEY);
  return value;
}

export function safeLocalPath(value: string | undefined | null, fallback = "/dashboard") {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return fallback;
  }
  return value;
}
