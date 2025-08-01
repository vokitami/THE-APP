import sqlite3 from 'sqlite3';

// Conectar a SQLite
const db = new sqlite3.Database('./users.db', (err) => {
  if (err) console.error('❌ Error conectando a la base de datos', err);
  else console.log('✅ Conectado a SQLite');
});

// Crear tabla de usuarios
db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  email TEXT UNIQUE,
  password TEXT,
  status TEXT DEFAULT 'active',
  lastLogin TEXT
)`);

export default db;
