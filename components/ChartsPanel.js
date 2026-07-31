"use client";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { profitOf, monthKey } from "../lib/calc";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

export default function ChartsPanel({ transactions }) {
  const sold = transactions.filter((t) => t.status === "売却済み");

  // 月次集計（売却日ベース）
  const monthly = {};
  sold.forEach((t) => {
    const key = monthKey(t.sale_date) || "不明";
    if (!monthly[key]) monthly[key] = { sales: 0, profit: 0 };
    monthly[key].sales += Number(t.sale_price || 0);
    monthly[key].profit += profitOf(t);
  });
  const months = Object.keys(monthly).sort();

  const barData = {
    labels: months,
    datasets: [
      {
        label: "売上",
        data: months.map((m) => monthly[m].sales),
        backgroundColor: "#93c5fd",
      },
      {
        label: "利益",
        data: months.map((m) => monthly[m].profit),
        backgroundColor: "#1f6feb",
      },
    ],
  };

  // カテゴリ別集計
  const byCategory = {};
  transactions.forEach((t) => {
    const key = t.category?.trim() || "未分類";
    byCategory[key] = (byCategory[key] || 0) + 1;
  });
  const categories = Object.keys(byCategory);

  const doughnutData = {
    labels: categories,
    datasets: [
      {
        data: categories.map((c) => byCategory[c]),
        backgroundColor: [
          "#1f6feb",
          "#93c5fd",
          "#fbbf24",
          "#34d399",
          "#f87171",
          "#a78bfa",
          "#f472b6",
          "#facc15",
        ],
      },
    ],
  };

  return (
    <div>
      <h3>月次 売上・利益推移</h3>
      {months.length === 0 ? (
        <div className="empty">売却済みのデータがありません</div>
      ) : (
        <div className="chart-wrap">
          <Bar
            data={barData}
            options={{ responsive: true, maintainAspectRatio: false }}
          />
        </div>
      )}

      <h3 style={{ marginTop: 24 }}>カテゴリ別 件数</h3>
      {categories.length === 0 ? (
        <div className="empty">データがありません</div>
      ) : (
        <div className="chart-wrap" style={{ maxWidth: 320, margin: "0 auto" }}>
          <Doughnut
            data={doughnutData}
            options={{ responsive: true, maintainAspectRatio: false }}
          />
        </div>
      )}
    </div>
  );
}
