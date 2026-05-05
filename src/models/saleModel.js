const { getDatabase } = require("../config/database");

async function listSales(eventId) {
  const db = await getDatabase();
  const params = [];
  let where = "";

  if (eventId) {
    where = "WHERE e.id = ?";
    params.push(eventId);
  }

  // La consulta une ventas, tipos de boletas y eventos para mostrar el detalle completo.
  return db.all(
    `SELECT v.id,
            v.usuario,
            v.cantidad,
            v.total,
            v.fecha_compra,
            tb.id AS tipo_boleta_id,
            tb.tipo AS tipo_boleta,
            tb.precio,
            e.id AS evento_id,
            e.nombre AS evento_nombre,
            e.fecha AS evento_fecha,
            e.lugar AS evento_lugar
     FROM ventas v
     INNER JOIN tipos_boletas tb ON tb.id = v.tipo_boleta_id
     INNER JOIN eventos e ON e.id = tb.evento_id
     ${where}
     ORDER BY v.fecha_compra DESC, v.id DESC`,
    params
  );
}

async function createSale(saleData) {
  const db = await getDatabase();
  const ticketType = await db.get(
    "SELECT precio FROM tipos_boletas WHERE id = ?",
    saleData.tipo_boleta_id
  );

  if (!ticketType) {
    return null;
  }

  const total = Number(ticketType.precio) * Number(saleData.cantidad);
  const result = await db.run(
    `INSERT INTO ventas (usuario, tipo_boleta_id, cantidad, total)
     VALUES (?, ?, ?, ?)`,
    saleData.usuario,
    saleData.tipo_boleta_id,
    saleData.cantidad,
    total
  );

  return db.get(
    `SELECT v.id,
            v.usuario,
            v.cantidad,
            v.total,
            v.fecha_compra,
            tb.tipo AS tipo_boleta,
            e.nombre AS evento_nombre
     FROM ventas v
     INNER JOIN tipos_boletas tb ON tb.id = v.tipo_boleta_id
     INNER JOIN eventos e ON e.id = tb.evento_id
     WHERE v.id = ?`,
    result.lastID
  );
}

module.exports = {
  createSale,
  listSales,
};
