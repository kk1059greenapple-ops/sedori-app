import { NextResponse } from "next/server";
import { getDb } from "../../../../lib/db";

export async function PUT(request, { params }) {
  const { id } = params;
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

  await db.execute({
    sql: `UPDATE transactions SET
      item_name = ?, category = ?, source = ?, purchase_price = ?, shipping_cost = ?,
      selling_fee = ?, other_cost = ?, sale_price = ?, quantity = ?, status = ?, purchase_date = ?,
      sale_date = ?, memo = ?
      WHERE id = ?`,
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
      id,
    ],
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(request, { params }) {
  const { id } = params;
  const db = await getDb();
  await db.execute({ sql: "DELETE FROM transactions WHERE id = ?", args: [id] });
  return NextResponse.json({ ok: true });
}
