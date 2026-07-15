import { ITEMS, formatGBP, patPrice, type PriceItem } from "@/lib/pricing";

export type PackageSelection = Record<string, number>;

export type SelectedLine = {
  item: PriceItem;
  qty: number;
  subTotal: number;
  vat: number;
};

export function encodeSelection(selection: PackageSelection) {
  return encodeURIComponent(JSON.stringify(selection));
}

export function decodeSelection(value: string | undefined | null): PackageSelection {
  if (!value) {
    return {};
  }

  try {
    const parsed = JSON.parse(decodeURIComponent(value)) as Record<string, unknown>;
    const selection: PackageSelection = {};

    for (const [id, qty] of Object.entries(parsed)) {
      const num = typeof qty === "number" ? qty : Number(qty);
      if (Number.isFinite(num) && num > 0) {
        selection[id] = Math.floor(num);
      }
    }

    return selection;
  } catch {
    return {};
  }
}

export function selectionToLines(
  selection: PackageSelection,
  availableItems: PriceItem[] = ITEMS,
): SelectedLine[] {
  return Object.entries(selection)
    .filter(([, qty]) => qty > 0)
    .map(([id, qty]) => {
      const item = availableItems.find((entry) => entry.id === id);
      if (!item) {
        return null;
      }

      const subTotal = item.tiered && item.id === "d365-pat" ? patPrice(qty) : item.price * qty;
      const vat = item.exVat ? subTotal * 0.2 : 0;

      return { item, qty, subTotal, vat };
    })
    .filter((line): line is SelectedLine => Boolean(line));
}

export function selectionSummary(selection: PackageSelection, availableItems: PriceItem[] = ITEMS) {
  const lines = selectionToLines(selection, availableItems);

  if (lines.length === 0) {
    return "No package items selected.";
  }

  const total = lines.reduce((sum, line) => sum + line.subTotal, 0);
  const vatTotal = lines.reduce((sum, line) => sum + line.vat, 0);

  return [
    "Selected package items",
    "",
    ...lines.map((line) => {
      const qtyLabel = line.qty > 1 ? `${line.qty} x ` : "";
      const vatLabel = line.item.exVat ? " +VAT" : "";
      return `${qtyLabel}${line.item.name} - ${formatGBP(line.subTotal)}${vatLabel}`;
    }),
    "",
    `Subtotal: ${formatGBP(total)}`,
    `VAT (where applicable): ${formatGBP(vatTotal)}`,
    `Total: ${formatGBP(total + vatTotal)}`,
  ].join("\n");
}
