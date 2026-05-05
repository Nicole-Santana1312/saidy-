const { getDatabase } = require("../config/database");

async function getRevenueByEvent() {
  const db = await getDatabase();

  // Reporte SQL agrupado por evento con ingresos y boletas vendidas.
  return db.all(`
    SELECT e.id AS evento_id,
           e.nombre AS evento_nombre,
           e.fecha AS evento_fecha,
           e.lugar AS evento_lugar,
           COALESCE(SUM(v.total), 0) AS ingresos,
           COALESCE(SUM(v.cantidad), 0) AS boletas_vendidas,
           COUNT(v.id) AS total_ventas
    FROM eventos e
    LEFT JOIN tipos_boletas tb ON tb.evento_id = e.id
    LEFT JOIN ventas v ON v.tipo_boleta_id = tb.id
    GROUP BY e.id, e.nombre, e.fecha, e.lugar
    ORDER BY ingresos DESC, boletas_vendidas DESC, e.fecha ASC
  `);
}

async function getReportSummary() {
  const db = await getDatabase();

  return db.get(`
    SELECT COALESCE(SUM(total), 0) AS ingresos_totales,
           COALESCE(SUM(cantidad), 0) AS boletas_vendidas,
           COUNT(id) AS total_ventas
    FROM ventas
  `);
}

module.exports = {
  getReportSummary,
  getRevenueByEvent,
};
