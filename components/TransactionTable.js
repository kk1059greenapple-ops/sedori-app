"use client";
import { useState } from "react";
import { profitOf, totalSaleOf, yen } from "../lib/calc";

export default function TransactionTable({ transactions, onEdit, onDeleted }) {
  const [statusFilter, setStatusFilter] = useState("all");
  const [keyword, setKeyword] = useState("");

  const filtered = transactions.filter((t) => {
    if (statusFilter !== "all" && t.status !== statusFilter) return false;
    if (keyword && !`${t.item_name} ${t.category} ${t.source}`.includes(keyword))
      return false;
    return true;
  });

  async function remove(id) {
    if (!confirm("この記録を削除しますか？")) return;
    await fetch(`/api/transactions/${id}`, { method: "DELETE" });
    onDeleted();
  }

  return (
    <div>
      <div className="filter-row">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">すべて</option>
          <option value="未売却">未売却</option>
          <option value="売却済み">売却済み</option>
        </select>
        <input
          placeholder="商品名・カテゴリ・仕入れ先で検索"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
      </div>
      {filtered.length === 0 ? (
        <div className="empty">記録がありません</div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>商品名</th>
                <th>カテゴリ</th>
                <th>仕入れ先</th>
                <th>個数</th>
                <th>仕入れ値(単価)</th>
                <th>売値(単価)</th>
                <th>売上合計</th>
                <th>利益</th>
                <th>状態</th>
                <th>仕入れ日</th>
                <th>売却日</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => {
                const profit = profitOf(t);
                return (
                  <tr key={t.id}>
                    <td>{t.item_name}</td>
                    <td>{t.category}</td>
                    <td>{t.source}</td>
                    <td>{t.quantity || 1}</td>
                    <td>{yen(t.purchase_price)}</td>
                    <td>{yen(t.sale_price)}</td>
                    <td>{yen(totalSaleOf(t))}</td>
                    <td style={{ color: profit >= 0 ? "#16a34a" : "#dc2626" }}>
                      {yen(profit)}
                    </td>
                    <td>
                      <span className={`status-badge ${t.status}`}>{t.status}</span>
                    </td>
                    <td>{t.purchase_date || "-"}</td>
                    <td>{t.sale_date || "-"}</td>
                    <td>
                      <div className="row-actions">
                        <button className="secondary" onClick={() => onEdit(t)}>
                          編集
                        </button>
                        <button className="danger" onClick={() => remove(t.id)}>
                          削除
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
