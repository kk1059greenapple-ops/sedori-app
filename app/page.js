"use client";
import { useEffect, useState } from "react";
import EntryForm from "../components/EntryForm";
import TransactionTable from "../components/TransactionTable";
import SummaryCards from "../components/SummaryCards";
import ChartsPanel from "../components/ChartsPanel";

export default function Home() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("list"); // list | add | charts
  const [editing, setEditing] = useState(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/transactions");
    const data = await res.json();
    setTransactions(data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function handleSaved() {
    setEditing(null);
    setTab("list");
    load();
  }

  function handleEdit(t) {
    setEditing(t);
    setTab("add");
  }

  return (
    <div>
      <header className="app-header">
        <h1>せどり収支管理</h1>
      </header>
      <div className="container">
        <SummaryCards transactions={transactions} />

        <div className="tabs">
          <button
            className={tab === "list" ? "active" : ""}
            onClick={() => setTab("list")}
          >
            一覧
          </button>
          <button
            className={tab === "add" ? "active" : ""}
            onClick={() => {
              setEditing(null);
              setTab("add");
            }}
          >
            {editing ? "編集中" : "新規登録"}
          </button>
          <button
            className={tab === "charts" ? "active" : ""}
            onClick={() => setTab("charts")}
          >
            集計グラフ
          </button>
        </div>

        {tab === "add" && (
          <div className="panel">
            <EntryForm
              editing={editing}
              onSaved={handleSaved}
              onCancel={() => {
                setEditing(null);
                setTab("list");
              }}
            />
          </div>
        )}

        {tab === "list" && (
          <div className="panel">
            {loading ? (
              <div className="empty">読み込み中...</div>
            ) : (
              <TransactionTable
                transactions={transactions}
                onEdit={handleEdit}
                onDeleted={load}
              />
            )}
          </div>
        )}

        {tab === "charts" && (
          <div className="panel">
            <ChartsPanel transactions={transactions} />
          </div>
        )}
      </div>
    </div>
  );
}
