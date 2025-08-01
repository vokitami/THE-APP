import sqlite3 from 'sqlite3';

// Connect to SQLite
const db = new sqlite3.Database('./users.db', (err) => {
  if (err) console.error('❌ Error connecting to the database', err);
  else console.log('✅ Connected to SQLite');
});

// Create users table
db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  email TEXT UNIQUE,
  password TEXT,
  status TEXT DEFAULT 'active',
  lastLogin TEXT
)`);

export default db;
