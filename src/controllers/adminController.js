const eventModel = require("../models/eventModel");
const saleModel = require("../models/saleModel");
const userModel = require("../models/userModel");

async function dashboard(req, res, next) {
  try {
    const [events, users, sales] = await Promise.all([
      eventModel.listEvents(),
      userModel.listUsers(),
      saleModel.listSales(),
    ]);

    const activeEvents = events.filter((event) => event.estado === "activo");
    const soldTickets = sales.reduce((sum, sale) => sum + Number(sale.cantidad || 0), 0);
    const totalRevenue = sales.reduce((sum, sale) => sum + Number(sale.total || 0), 0);
    const latestSales = sales.slice(0, 5);
    const upcomingEvents = events
      .filter((event) => event.estado !== "finalizado")
      .slice(0, 5);

    const email = escapeHtml(req.admin.email);
    const adminLinks =
      req.admin.role === "super_admin"
        ? `<a class="nav-link" href="/admin/admins" data-section="admins">
            <span aria-hidden="true">AD</span>
            Admins
          </a>`
        : "";

    return res.send(`
      <!doctype html>
      <html lang="es">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>Dashboard - Eventix</title>
          <link rel="stylesheet" href="/styles.css" />
          <script src="/admin-dashboard.js" defer></script>
        </head>
        <body>
          <div class="admin-layout" data-dashboard>
            <aside class="sidebar" id="sidebar">
              <div class="brand-block">
                <img class="brand-logo" src="/eventix-logo.svg" alt="Eventix" />
                <div>
                  <strong>Eventix</strong>
                  <span>Administrador</span>
                </div>
              </div>

              <nav class="sidebar-nav" aria-label="Navegacion principal">
                <a class="nav-link active" href="/admin/eventos" data-section="eventos">
                  <span aria-hidden="true">EV</span>
                  Eventos
                </a>
                <a class="nav-link" href="/admin/boletas" data-section="boletas">
                  <span aria-hidden="true">BO</span>
                  Boletas
                </a>
                <a class="nav-link" href="/admin/usuarios" data-section="usuarios">
                  <span aria-hidden="true">US</span>
                  Usuarios
                </a>
                <a class="nav-link" href="/admin/ventas" data-section="ventas">
                  <span aria-hidden="true">VE</span>
                  Ventas
                </a>
                <a class="nav-link" href="/admin/reportes" data-section="reportes">
                  <span aria-hidden="true">RE</span>
                  Reportes
                </a>
                <a class="nav-link" href="/admin/check-in" data-section="checkin">
                  <span aria-hidden="true">CH</span>
                  Check-in
                </a>
                ${adminLinks}
              </nav>

              <form action="/auth/logout" method="post" class="sidebar-footer">
                <p>Sesion: ${email}</p>
                <p>Rol: ${req.admin.role === "super_admin" ? "Admin principal" : "Administrador"}</p>
                <button class="ghost-button" type="submit">Cerrar sesion</button>
              </form>
            </aside>

            <main class="admin-main">
              <header class="dashboard-header">
                <button class="menu-button" type="button" data-menu-toggle aria-controls="sidebar" aria-expanded="false">
                  <span></span>
                  <span></span>
                  <span></span>
                </button>
                <div>
                  <p class="eyebrow">Eventix</p>
                  <h1>Dashboard administrativo</h1>
                </div>
                <div class="header-status">
                  <span></span>
                  Sistema activo
                </div>
              </header>

              <section class="stats-grid" aria-label="Estadisticas principales">
                <article class="stat-card">
                  <span class="stat-label">Total de eventos</span>
                  <strong class="stat-value" data-count="${events.length}">0</strong>
                  <small>${activeEvents.length} eventos activos</small>
                </article>
                <article class="stat-card accent-green">
                  <span class="stat-label">Total de usuarios</span>
                  <strong class="stat-value" data-count="${users.length}">0</strong>
                  <small>${users.filter((user) => user.is_verified).length} usuarios verificados</small>
                </article>
                <article class="stat-card accent-coral">
                  <span class="stat-label">Boletas vendidas</span>
                  <strong class="stat-value" data-count="${soldTickets}">0</strong>
                  <small>${formatCurrency(totalRevenue)} generados</small>
                </article>
              </section>

              <section class="content-grid">
                <article class="dashboard-section" id="eventos">
                  <div class="section-heading">
                    <div>
                      <p class="eyebrow">Eventos</p>
                      <h2>Proximos eventos</h2>
                    </div>
                    <a class="compact-button" href="/admin/eventos">Nuevo evento</a>
                  </div>
                  <div class="event-list">
                    ${renderUpcomingEvents(upcomingEvents)}
                  </div>
                </article>

                <article class="dashboard-section" id="ventas">
                  <div class="section-heading">
                    <div>
                      <p class="eyebrow">Ventas</p>
                      <h2>Resumen</h2>
                    </div>
                  </div>
                  <div class="event-list">
                    <div class="event-row">
                      <div>
                        <strong>${formatCurrency(totalRevenue)}</strong>
                        <span>Ingresos registrados</span>
                      </div>
                      <span class="pill">${sales.length} ventas</span>
                    </div>
                  </div>
                </article>
              </section>

              <section class="table-section" id="boletas">
                <div class="section-heading">
                  <div>
                    <p class="eyebrow">Boletas</p>
                    <h2>Ultimas ventas</h2>
                  </div>
                  <span class="table-note" id="usuarios">Datos reales</span>
                </div>
                <div class="responsive-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Cliente</th>
                        <th>Evento</th>
                        <th>Boletas</th>
                        <th>Total</th>
                        <th>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${renderSalesRows(latestSales)}
                    </tbody>
                  </table>
                </div>
              </section>
            </main>
          </div>
        </body>
      </html>
    `);
  } catch (error) {
    return next(error);
  }
}

function renderUpcomingEvents(events) {
  if (events.length === 0) {
    return `<p class="empty-state">No hay eventos registrados.</p>`;
  }

  return events
    .map(
      (event) => `
        <div class="event-row">
          <div>
            <strong>${escapeHtml(event.nombre)}</strong>
            <span>${escapeHtml(event.lugar)} - ${formatDate(event.fecha)}</span>
          </div>
          <span class="pill${event.estado === "pausado" ? " warning" : ""}">${formatStatus(event.estado)}</span>
        </div>
      `
    )
    .join("");
}

function renderSalesRows(sales) {
  if (sales.length === 0) {
    return `
      <tr>
        <td colspan="5" class="empty-table">Todavia no hay ventas registradas.</td>
      </tr>
    `;
  }

  return sales
    .map(
      (sale) => `
        <tr>
          <td>${escapeHtml(sale.usuario)}</td>
          <td>${escapeHtml(sale.evento_nombre || "Sin evento")}</td>
          <td>${Number(sale.cantidad).toLocaleString("es-DO")}</td>
          <td>${formatCurrency(sale.total)}</td>
          <td><span class="pill">Pagado</span></td>
        </tr>
      `
    )
    .join("");
}

function formatStatus(value) {
  const labels = {
    activo: "Activo",
    pausado: "Pausado",
    finalizado: "Finalizado",
  };

  return labels[value] || "Activo";
}

function formatDate(value) {
  return new Intl.DateTimeFormat("es-DO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

function formatCurrency(value) {
  return new Intl.NumberFormat("es-DO", {
    style: "currency",
    currency: "DOP",
  }).format(Number(value || 0));
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

module.exports = {
  dashboard,
};
