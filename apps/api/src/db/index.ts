import path from "node:path";
import fs from "node:fs";
import initSqlJs, { Database } from "sql.js";

const dbPath = path.join(
  __dirname,
  "..",
  "..",
  "data",
  "conversation-trainer.db",
);

let db: Database | null = null;

export async function initDb(): Promise<Database> {
  if (db) return db;

  const SQL = await initSqlJs();

  // Ensure data directory exists
  const dataDir = path.dirname(dbPath);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // Load existing database or create new one
  try {
    if (fs.existsSync(dbPath)) {
      const fileBuffer = fs.readFileSync(dbPath);
      db = new SQL.Database(fileBuffer);
    } else {
      db = new SQL.Database();
    }
  } catch (error) {
    db = new SQL.Database();
  }

  db.run(`
  CREATE TABLE IF NOT EXISTS conversations (
    id TEXT PRIMARY KEY,
    scenario_id TEXT NOT NULL,
    user_id TEXT,
    current_node_id TEXT,
    path_history TEXT,
    context_variables TEXT,
    status TEXT CHECK(status IN ('active', 'completed', 'abandoned')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS interaction_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    conversation_id TEXT,
    node_id TEXT,
    user_input TEXT,
    selected_edge_id TEXT,
    response_time_ms INTEGER,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  `);

  return db;
}

export function saveDb(): void {
  if (db) {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(dbPath, buffer);
  }
}

export { db };
