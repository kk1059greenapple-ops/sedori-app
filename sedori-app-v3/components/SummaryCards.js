"use client";
import { profitOf, totalCostOf, totalSaleOf, yen } from "../lib/calc";

export default function SummaryCards({ transactions }) {
  const sold = transactions.filter((t) => t.status === "売却済み");
  const unsold = transactions.filter((t) => t.status !== "売却済み");

  const totalSales = sold.reduce((s, t) => s + totalSaleOf(t), 0);
  const totalCost = sold.reduce((s, t) => s + totalCostOf(t), 0);
  const netProfit = sold.reduce((s, t) => s + profitOf(t), 0);
  const margin = totalSales > 0 ? (netProfit / totalSales) * 100 : 0;
  const inventoryCost = unsold.reduce((s, t) => s + totalCostOf(t), 0);
  const inventoryQty = unsold.reduce((s, t) => s + Number(t.quantity || 1), 0);
  // 現在の資産 = まだ売れていない在庫の仕入れコスト + これまでに確定した純利益
  const currentAssets = inventoryCost + netProfit;

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
        <div className="label">総経費（仕入れ+送料+手数料等）</div>
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
