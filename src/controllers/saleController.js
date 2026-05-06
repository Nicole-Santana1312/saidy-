const saleModel = require("../models/saleModel");

async function renderSalesPage(req, res) {
  return res.send(`
    <!doctype html>
    <html lang="es">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Ventas - Eventix</title>
        <link rel="stylesheet" href="/styles.css" />
        <script src="/sales.js" defer></script>
      </head>
      <body>
        <main class="events-page">
          <header class="events-header">
            <div>
              <p class="eyebrow">Administracion</p>
              <h1>Ventas de boletas</h1>
            </div>
            <a class="link-button" href="/admin/dashboard">Volver al dashboard</a>
          </header>

          <section class="events-list-panel">
            <div class="section-heading">
              <div>
                <p class="eyebrow">Consulta SQL</p>
                <h2>Lista de ventas</h2>
              </div>
              <select class="filter-select" data-sale-event-filter aria-label="Filtrar ventas por evento">
                <option value="">Todos los eventos</option>
              </select>
            </div>

            <div class="responsive-table">
              <table class="sales-table">
                <thead>
                  <tr>
                    <th>Usuario</th>
                    <th>Evento</th>
                    <th>Tipo de boleta</th>
                    <th>Cantidad</th>
                    <th>Total</th>
                    <th>Pago</th>
                    <th>Fecha compra</th>
                  </tr>
                </thead>
                <tbody data-sales-table-body></tbody>
              </table>
            </div>
          </section>
        </main>
      </body>
    </html>
  `);
}

async function listSales(req, res, next) {
  try {
    const sales = await saleModel.listSales(req.query.evento_id);
    return res.json({ sales });
  } catch (error) {
    return next(error);
  }
}

async function createSale(req, res, next) {
  try {
    const sale = await saleModel.createSale(req.body);

    if (!sale) {
      return res.status(404).json({ message: "Tipo de boleta no encontrado." });
    }

    return res.status(201).json({
      message: "Venta registrada correctamente.",
      sale,
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  renderSalesPage,
  listSales,
  createSale,
};
