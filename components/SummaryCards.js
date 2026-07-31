"use client";
import { profitOf, totalCostOf, totalSaleOf, yen } from "../lib/calc";

export default function SummaryCards({ transactions }) {
  const sold = transactions.filter((t) => t.status === "売却済み");
  const unsold = transactions.filter((t) => t.status !== "売却済み");

  const totalSales = sold.reduce((s, t) => s + totalSaleOf(t), 0);
  // 総経費は売却済み・未売却を問わず、すべての仕入れ関連コストを合計する
  const totalCost = transactions.reduce((s, t) => s + totalCostOf(t), 0);
  // 売却済み商品だけで見た利益（利益率の算出に使用）
  const realizedProfit = sold.reduce((s, t) => s + profitOf(t), 0);
  const margin = totalSales > 0 ? (realizedProfit / totalSales) * 100 : 0;
  const inventoryCost = unsold.reduce((s, t) => s + totalCostOf(t), 0);
  const inventoryQty = unsold.reduce((s, t) => s + Number(t.quantity || 1), 0);
  // 純利益 = 売却済み商品の利益 - まだ売れていない在庫の仕入れ代（財布から出て行った分もすぐ引く）
  const netProfit = realizedProfit - inventoryCost;
  // 現在の資産 = 在庫の投資額 + 売却済み商品の利益（在庫はまだ価値として手元にある）
  const currentAssets = inventoryCost + realizedProfit;

  return (
    <div className="summary-grid">
      <div className="card">
        <div className="label">現在の資産（在庫+利益）</div>
        <div className={`value ${currentAssets >= 0 ? "positive" : "negative"}`}>
          {yen(currentAssets)}
        </div>
      </div>
      <div className="card">
        <div className="label">総売上（売却済み）</div>
        <div className="value">{yen(totalSales)}</div>
      </div>
      <div className="card">
        <div className="label">総経費（全ての仕入れ・未売却分含む）</div>
        <div className="value">{yen(totalCost)}</div>
      </div>
      <div className="card">
        <div className="label">純利益</div>
        <div className={`value ${netProfit >= 0 ? "positive" : "negative"}`}>
          {yen(netProfit)}
        </div>
      </div>
      <div className="card">
        <div className="label">利益率</div>
        <div className={`value ${margin >= 0 ? "positive" : "negative"}`}>
          {margin.toFixed(1)}%
        </div>
      </div>
      <div className="card">
        <div className="label">在庫（未売却）件数・個数</div>
        <div className="value">
          {unsold.length}件 / {inventoryQty}個
        </div>
      </div>
      <div className="card">
        <div className="label">在庫の投資額</div>
        <div className="value">{yen(inventoryCost)}</div>
      </div>
    </div>
  );
}
