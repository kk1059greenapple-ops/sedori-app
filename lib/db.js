import { createClient } from "@libsql/client";

// Tursoの接続情報が無い場合は、ローカルファイルDB(local.db)を自動的に使用します。
// これによりデプロイ前でも `npm run dev` だけで動作確認ができます。
const url = process.env.TURSO_DATABASE_URL || "file:local.db";
const authToken = process.env.TURSO_AUTH_TOKEN;

let client;

function getClient() {
  if (!client) {
    client = createClient(
      authToken ? { url, authToken } : { url }
    );
  }
  return client;
}

let initialized = false;

export async function initDb() {
  if (initialized) return;
  const db = getClient();
  await db.execute(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      item_name TEXT NOT NULL,
      category TEXT,
      source TEXT,
      purchase_price REAL NOT NULL DEFAULT 0,
      shipping_cost REAL NOT NULL DEFAULT 0,
      selling_fee REAL NOT NULL DEFAULT 0,
      other_cost REAL NOT NULL DEFAULT 0,
      sale_price REAL NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT '未売却',
      purchase_date TEXT,
      sale_date TEXT,
      memo TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);
  initialized = true;
}

export async function getDb() {
  await initDb();
  return getClient();
}
