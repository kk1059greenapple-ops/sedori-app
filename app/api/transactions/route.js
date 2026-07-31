import { NextResponse } from "next/server";
import { getDb } from "../../../lib/db";

export async function GET() {
  const db = await getDb();
  const result = await db.execute(
    "SELECT * FROM transactions ORDER BY COALESCE(sale_date, purchase_date, created_at) DESC, id DESC"
  );
  return NextResponse.json(result.rows);
}

export async function POST(request) {
  const body = await request.json();
  const db = await getDb();

  const {
    item_name,
    category = "",
    source = "",
    purchase_price = 0,
    shipping_cost = 0,
    selling_fee = 0,
    other_cost = 0,
    sale_price = 0,
    quantity = 1,
    status = "未売却",
    purchase_date = null,
    sale_date = null,
    memo = "",
  } = body;

  if (!item_name || item_name.trim() === "") {
    return NextResponse.json(
      { error: "商品名は必須です" },
      { status: 400 }
    );
  }

  const result = await db.execute({
    sql: `INSERT INTO transactions
      (item_name, category, source, purchase_price, shipping_cost, selling_fee, other_cost, sale_price, quantity, status, purchase_date, sale_date, memo)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      item_name,
      category,
      source,
      Number(purchase_price) || 0,
      Number(shipping_cost) || 0,
      Number(selling_fee) || 0,
      Number(other_cost) || 0,
      Number(sale_price) || 0,
      Number(quantity) || 1,
      status,
      purchase_date,
      sale_date,
      memo,
    ],
  });

  return NextResponse.json(
    { id: Number(result.lastInsertRowid) },
    { status: 201 }
  );
}
