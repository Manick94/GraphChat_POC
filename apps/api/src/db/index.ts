import path from 'node:path';
import Database from 'better-sqlite3';

const dbPath = path.join(__dirname, '..', '..', 'data', 'conversation-trainer.db');
export const db = new Database(dbPath);

db.exec(`
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
