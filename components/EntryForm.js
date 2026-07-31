"use client";
import { useEffect, useState } from "react";

const empty = {
  item_name: "",
  category: "",
  source: "",
  purchase_price: "",
  shipping_cost: "",
  selling_fee: "",
  other_cost: "",
  sale_price: "",
  quantity: "1",
  status: "未売却",
  purchase_date: "",
  sale_date: "",
  memo: "",
};

export default function EntryForm({ editing, onSaved, onCancel }) {
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (editing) {
      setForm({
        ...empty,
        ...editing,
        purchase_price: editing.purchase_price ?? "",
        shipping_cost: editing.shipping_cost ?? "",
        selling_fee: editing.selling_fee ?? "",
        other_cost: editing.other_cost ?? "",
        sale_price: editing.sale_price ?? "",
        quantity: editing.quantity ?? "1",
        purchase_date: editing.purchase_date || "",
        sale_date: editing.sale_date || "",
      });
    } else {
      setForm(empty);
    }
  }, [editing]);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function submit(e) {
    e.preventDefault();
    setError("");
    if (!form.item_name.trim()) {
      setError("商品名を入力してください");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        purchase_price: Number(form.purchase_price) || 0,
        shipping_cost: Number(form.shipping_cost) || 0,
        selling_fee: Number(form.selling_fee) || 0,
        other_cost: Number(form.other_cost) || 0,
        sale_price: Number(form.sale_price) || 0,
        quantity: Number(form.quantity) || 1,
        purchase_date: form.purchase_date || null,
        sale_date: form.sale_date || null,
      };
      const url = editing ? `/api/transactions/${editing.id}` : "/api/transactions";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "保存に失敗しました");
      }
      setForm(empty);
      onSaved();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="entry-form" onSubmit={submit}>
      <label>
        商品名 *
        <input
          value={form.item_name}
          onChange={(e) => update("item_name", e.target.value)}
          placeholder="例）Nintendo Switch本体"
        />
      </label>
      <label>
        カテゴリ
        <input
          value={form.category}
          onChange={(e) => update("category", e.target.value)}
          placeholder="例）ゲーム"
        />
      </label>
      <label>
        仕入れ先
        <input
          value={form.source}
          onChange={(e) => update("source", e.target.value)}
          placeholder="例）ハードオフ 渋谷店"
        />
      </label>
      <label>
        個数
        <input
          type="number"
          min="1"
          value={form.quantity}
          onChange={(e) => update("quantity", e.target.value)}
        />
      </label>
      <label>
        仕入れ値（円）
        <input
          type="number"
          value={form.purchase_price}
          onChange={(e) => update("purchase_price", e.target.value)}
        />
      </label>
      <label>
        送料（円）
        <input
          type="number"
          value={form.shipping_cost}
          onChange={(e) => update("shipping_cost", e.target.value)}
        />
      </label>
      <label>
        販売手数料（円）
        <input
          type="number"
          value={form.selling_fee}
          onChange={(e) => update("selling_fee", e.target.value)}
        />
      </label>
      <label>
        その他経費（円）
        <input
          type="number"
          value={form.other_cost}
          onChange={(e) => update("other_cost", e.target.value)}
        />
      </label>
      <label>
        売値（円）
        <input
          type="number"
          value={form.sale_price}
          onChange={(e) => update("sale_price", e.target.value)}
        />
      </label>
      <label>
        ステータス
        <select value={form.status} onChange={(e) => update("status", e.target.value)}>
          <option value="未売却">未売却</option>
          <option value="売却済み">売却済み</option>
        </select>
      </label>
      <label>
        仕入れ日
        <input
          type="date"
          value={form.purchase_date}
          onChange={(e) => update("purchase_date", e.target.value)}
        />
      </label>
      <label>
        売却日
        <input
          type="date"
          value={form.sale_date}
          onChange={(e) => update("sale_date", e.target.value)}
        />
      </label>
      <label style={{ gridColumn: "1 / -1" }}>
        メモ
        <textarea
          rows={2}
          value={form.memo}
          onChange={(e) => update("memo", e.target.value)}
        />
      </label>
      {error && (
        <div style={{ gridColumn: "1 / -1", color: "#dc2626", fontSize: "0.85rem" }}>
          {error}
        </div>
      )}
      <div className="form-actions">
        <button type="submit" className="primary" disabled={saving}>
          {saving ? "保存中..." : editing ? "更新する" : "登録する"}
        </button>
        {editing && (
          <button type="button" className="secondary" onClick={onCancel}>
            キャンセル
          </button>
        )}
      </div>
    </form>
  );
}
