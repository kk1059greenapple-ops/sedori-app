// 金額計算・整形の共通ロジック

export function profitOf(t) {
  return (
    Number(t.sale_price || 0) -
    Number(t.purchase_price || 0) -
    Number(t.shipping_cost || 0) -
    Number(t.selling_fee || 0) -
    Number(t.other_cost || 0)
  );
}

export function totalCostOf(t) {
  return (
    Number(t.purchase_price || 0) +
    Number(t.shipping_cost || 0) +
    Number(t.selling_fee || 0) +
    Number(t.other_cost || 0)
  );
}

export function yen(n) {
  const v = Math.round(Number(n) || 0);
  return v.toLocaleString("ja-JP") + "円";
}

export function monthKey(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return null;
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}
