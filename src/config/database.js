const path = require("path");
const fs = require("fs");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

let database;

async function getDatabase() {
  if (!database) {
    const dataDir = path.join(__dirname, "..", "..", "data");
    fs.mkdirSync(dataDir, { recursive: true });

    database = await open({
      filename: path.join(dataDir, "boletas.sqlite"),
      driver: sqlite3.Database,
    });
  }

  return database;
}

async function initializeDatabase() {
  const db = await getDatabase();
  await db.exec("PRAGMA foreign_keys = ON;");

  // La tabla guarda los datos principales de cada evento del sistema.
  await db.exec(`
    CREATE TABLE IF NOT EXISTS eventos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      fecha TEXT NOT NULL,
      lugar TEXT NOT NULL,
      descripcion TEXT NOT NULL,
      imagen TEXT NOT NULL,
      creado_en TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      actualizado_en TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS tipos_boletas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      evento_id INTEGER NOT NULL,
      tipo TEXT NOT NULL CHECK (tipo IN ('General', 'VIP', 'Preferencial')),
      precio REAL NOT NULL CHECK (precio >= 0),
      cantidad_disponible INTEGER NOT NULL CHECK (cantidad_disponible >= 0),
      creado_en TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      actualizado_en TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (evento_id) REFERENCES eventos(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS ventas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario TEXT NOT NULL,
      tipo_boleta_id INTEGER NOT NULL,
      cantidad INTEGER NOT NULL CHECK (cantidad > 0),
      total REAL NOT NULL CHECK (total >= 0),
      fecha_compra TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (tipo_boleta_id) REFERENCES tipos_boletas(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      telefono TEXT,
      creado_en TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Usuarios iniciales para que el modulo tenga datos visibles al arrancar.
  await db.run(
    `INSERT OR IGNORE INTO usuarios (nombre, email, telefono)
     VALUES (?, ?, ?)`,
    "Laura Mendez",
    "laura@example.com",
    "809-555-0101"
  );
  await db.run(
    `INSERT OR IGNORE INTO usuarios (nombre, email, telefono)
     VALUES (?, ?, ?)`,
    "Carlos Perez",
    "carlos@example.com",
    "809-555-0102"
  );
  await db.run(
    `INSERT OR IGNORE INTO usuarios (nombre, email, telefono)
     VALUES (?, ?, ?)`,
    "Ana Rodriguez",
    "ana@example.com",
    "809-555-0103"
  );
}

module.exports = {
  getDatabase,
  initializeDatabase,
};
