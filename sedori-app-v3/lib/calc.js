// 金額計算・整形の共通ロジック

// quantity（個数）は在庫の管理・表示のための項目で、金額の掛け算には使わない。
// purchase_price, shipping_cost, selling_fee, other_cost, sale_price は
// その取引の「合計金額」としてそのまま入力してもらう想定。
export function qtyOf(t) {
  const q = Number(t.quantity || 1);
  return q > 0 ? q : 1;
}

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

export function totalSaleOf(t) {
  return Number(t.sale_price || 0);
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
