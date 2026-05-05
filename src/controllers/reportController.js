const reportModel = require("../models/reportModel");

async function renderReportsPage(req, res) {
  return res.send(`
    <!doctype html>
    <html lang="es">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Reportes - Eventix</title>
        <link rel="stylesheet" href="/styles.css" />
        <script src="/reports.js" defer></script>
      </head>
      <body>
        <main class="events-page">
          <header class="events-header">
            <div>
              <p class="eyebrow">Administrador</p>
              <h1>Reportes de ventas</h1>
            </div>
            <a class="link-button" href="/admin/dashboard">Volver al dashboard</a>
          </header>

          <section class="stats-grid report-summary" aria-label="Resumen de reportes">
            <article class="stat-card">
              <span class="stat-label">Ingresos totales</span>
              <strong class="stat-value compact-stat" data-total-income>RD$ 0</strong>
              <small>Suma de ventas registradas</small>
            </article>
            <article class="stat-card accent-green">
              <span class="stat-label">Boletas vendidas</span>
              <strong class="stat-value compact-stat" data-total-tickets>0</strong>
              <small>Cantidad acumulada</small>
            </article>
            <article class="stat-card accent-coral">
              <span class="stat-label">Total de ventas</span>
              <strong class="stat-value compact-stat" data-total-sales>0</strong>
              <small>Compras registradas</small>
            </article>
          </section>

          <section class="events-list-panel">
            <div class="section-heading">
              <div>
                <p class="eyebrow">Grafica</p>
                <h2>Ingresos por evento</h2>
              </div>
            </div>
            <div class="report-chart" data-report-chart></div>
          </section>

          <section class="events-list-panel">
            <div class="section-heading">
              <div>
                <p class="eyebrow">Consulta SQL</p>
                <h2>Reporte detallado</h2>
              </div>
            </div>
            <div class="responsive-table">
              <table class="sales-table">
                <thead>
                  <tr>
                    <th>Evento</th>
                    <th>Fecha</th>
                    <th>Lugar</th>
                    <th>Ingresos</th>
                    <th>Boletas vendidas</th>
                    <th>Ventas</th>
                  </tr>
                </thead>
                <tbody data-report-table-body></tbody>
              </table>
            </div>
          </section>
        </main>
      </body>
    </html>
  `);
}

async function getReports(req, res, next) {
  try {
    const [summary, revenueByEvent] = await Promise.all([
      reportModel.getReportSummary(),
      reportModel.getRevenueByEvent(),
    ]);

    return res.json({
      summary,
      revenueByEvent,
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getReports,
  renderReportsPage,
};
