import {
  createBookingSelection,
  type PendingBookingSelection,
} from "@/lib/api/user-bookings.functions";

const PENDING_BOOKING_KEY = "cc_pending_booking_selection";

export function savePendingBookingSelection(selection: PendingBookingSelection) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(PENDING_BOOKING_KEY, JSON.stringify(selection));
}

export function loadPendingBookingSelection() {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(PENDING_BOOKING_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as PendingBookingSelection;
  } catch {
    window.localStorage.removeItem(PENDING_BOOKING_KEY);
    return null;
  }
}

export function clearPendingBookingSelection() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(PENDING_BOOKING_KEY);
}

export async function syncPendingBookingSelection() {
  const selection = loadPendingBookingSelection();
  if (!selection) {
    return null;
  }

  const result = await createBookingSelection({ data: selection });
  clearPendingBookingSelection();
  return result.booking;
}
