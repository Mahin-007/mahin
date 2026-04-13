import Database from 'better-sqlite3';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, 'news.db');

let db;

export function getDb() {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    initSchema();
  }
  return db;
}

function initSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS articles (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      summary TEXT,
      content TEXT,
      url TEXT UNIQUE NOT NULL,
      source TEXT NOT NULL,
      category TEXT,
      published_at TEXT,
      fetched_at TEXT NOT NULL,
      image_url TEXT,
      author TEXT
    );

    CREATE TABLE IF NOT EXISTS daily_briefs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT UNIQUE NOT NULL,
      brief TEXT NOT NULL,
      key_themes TEXT,
      generated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS connections (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      article_ids TEXT NOT NULL,
      connection_title TEXT NOT NULL,
      connection_description TEXT NOT NULL,
      strength TEXT DEFAULT 'medium',
      generated_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_articles_source ON articles(source);
    CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(published_at);
    CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
  `);
}
