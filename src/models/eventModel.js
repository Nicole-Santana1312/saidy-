const { getDatabase } = require("../config/database");

async function listEvents() {
  const db = await getDatabase();

  return db.all(`
    SELECT id, nombre, fecha, lugar, descripcion, imagen, creado_en, actualizado_en
    FROM eventos
    ORDER BY fecha ASC, id DESC
  `);
}

async function findEventById(id) {
  const db = await getDatabase();

  return db.get(
    `SELECT id, nombre, fecha, lugar, descripcion, imagen, creado_en, actualizado_en
     FROM eventos
     WHERE id = ?`,
    id
  );
}

async function createEvent(eventData) {
  const db = await getDatabase();
  const result = await db.run(
    `INSERT INTO eventos (nombre, fecha, lugar, descripcion, imagen)
     VALUES (?, ?, ?, ?, ?)`,
    eventData.nombre,
    eventData.fecha,
    eventData.lugar,
    eventData.descripcion,
    eventData.imagen
  );

  return findEventById(result.lastID);
}

async function updateEvent(id, eventData) {
  const db = await getDatabase();
  const result = await db.run(
    `UPDATE eventos
     SET nombre = ?,
         fecha = ?,
         lugar = ?,
         descripcion = ?,
         imagen = ?,
         actualizado_en = CURRENT_TIMESTAMP
     WHERE id = ?`,
    eventData.nombre,
    eventData.fecha,
    eventData.lugar,
    eventData.descripcion,
    eventData.imagen,
    id
  );

  if (result.changes === 0) {
    return null;
  }

  return findEventById(id);
}

async function deleteEvent(id) {
  const db = await getDatabase();
  const result = await db.run("DELETE FROM eventos WHERE id = ?", id);

  return result.changes > 0;
}

module.exports = {
  listEvents,
  findEventById,
  createEvent,
  updateEvent,
  deleteEvent,
};
