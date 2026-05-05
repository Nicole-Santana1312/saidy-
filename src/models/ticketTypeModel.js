const { getDatabase } = require("../config/database");

async function listTicketTypesByEvent(eventId) {
  const db = await getDatabase();

  return db.all(
    `SELECT tb.id,
            tb.evento_id,
            tb.tipo,
            tb.precio,
            tb.cantidad_disponible,
            tb.creado_en,
            tb.actualizado_en,
            e.nombre AS evento_nombre
     FROM tipos_boletas tb
     INNER JOIN eventos e ON e.id = tb.evento_id
     WHERE tb.evento_id = ?
     ORDER BY CASE tb.tipo
       WHEN 'General' THEN 1
       WHEN 'Preferencial' THEN 2
       WHEN 'VIP' THEN 3
       ELSE 4
     END`,
    eventId
  );
}

async function findTicketTypeById(id) {
  const db = await getDatabase();

  return db.get(
    `SELECT tb.id,
            tb.evento_id,
            tb.tipo,
            tb.precio,
            tb.cantidad_disponible,
            tb.creado_en,
            tb.actualizado_en,
            e.nombre AS evento_nombre
     FROM tipos_boletas tb
     INNER JOIN eventos e ON e.id = tb.evento_id
     WHERE tb.id = ?`,
    id
  );
}

async function createTicketType(ticketData) {
  const db = await getDatabase();
  const result = await db.run(
    `INSERT INTO tipos_boletas (evento_id, tipo, precio, cantidad_disponible)
     VALUES (?, ?, ?, ?)`,
    ticketData.evento_id,
    ticketData.tipo,
    ticketData.precio,
    ticketData.cantidad_disponible
  );

  return findTicketTypeById(result.lastID);
}

async function updateTicketType(id, ticketData) {
  const db = await getDatabase();
  const result = await db.run(
    `UPDATE tipos_boletas
     SET evento_id = ?,
         tipo = ?,
         precio = ?,
         cantidad_disponible = ?,
         actualizado_en = CURRENT_TIMESTAMP
     WHERE id = ?`,
    ticketData.evento_id,
    ticketData.tipo,
    ticketData.precio,
    ticketData.cantidad_disponible,
    id
  );

  if (result.changes === 0) {
    return null;
  }

  return findTicketTypeById(id);
}

async function deleteTicketType(id) {
  const db = await getDatabase();
  const result = await db.run("DELETE FROM tipos_boletas WHERE id = ?", id);

  return result.changes > 0;
}

module.exports = {
  listTicketTypesByEvent,
  findTicketTypeById,
  createTicketType,
  updateTicketType,
  deleteTicketType,
};
