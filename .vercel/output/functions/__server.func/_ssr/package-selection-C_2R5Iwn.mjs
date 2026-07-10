import { f as formatGBP, I as ITEMS, p as patPrice } from "./pricing-D5FjTA98.mjs";
function encodeSelection(selection) {
  return encodeURIComponent(JSON.stringify(selection));
}
function decodeSelection(value) {
  if (!value) {
    return {};
  }
  try {
    const parsed = JSON.parse(decodeURIComponent(value));
    const selection = {};
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
function selectionToLines(selection) {
  return Object.entries(selection).filter(([, qty]) => qty > 0).map(([id, qty]) => {
    const item = ITEMS.find((entry) => entry.id === id);
    if (!item) {
      return null;
    }
    const subTotal = item.tiered && item.id === "d365-pat" ? patPrice(qty) : item.price * qty;
    const vat = item.exVat ? subTotal * 0.2 : 0;
    return { item, qty, subTotal, vat };
  }).filter((line) => Boolean(line));
}
function selectionSummary(selection) {
  const lines = selectionToLines(selection);
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
    `Total: ${formatGBP(total + vatTotal)}`
  ].join("\n");
}
export {
  selectionToLines as a,
  decodeSelection as d,
  encodeSelection as e,
  selectionSummary as s
};
