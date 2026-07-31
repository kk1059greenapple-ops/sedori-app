// 金額計算・整形の共通ロジック

// purchase_price, shipping_cost, selling_fee, other_cost, sale_price は
// いずれも「1個あたりの金額」として入力してもらい、quantity(個数)を掛けて合計を算出する。
export function qtyOf(t) {
  const q = Number(t.quantity || 1);
  return q > 0 ? q : 1;
}

export function profitOf(t) {
  const q = qtyOf(t);
  return (
    Number(t.sale_price || 0) * q -
    Number(t.purchase_price || 0) * q -
    Number(t.shipping_cost || 0) * q -
    Number(t.selling_fee || 0) * q -
    Number(t.other_cost || 0) * q
  );
}

export function totalCostOf(t) {
  const q = qtyOf(t);
  return (
    (Number(t.purchase_price || 0) +
      Number(t.shipping_cost || 0) +
      Number(t.selling_fee || 0) +
      Number(t.other_cost || 0)) *
    q
  );
}

export function totalSaleOf(t) {
  return Number(t.sale_price || 0) * qtyOf(t);
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
