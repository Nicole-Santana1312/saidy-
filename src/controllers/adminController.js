function dashboard(req, res) {
  const email = escapeHtml(req.admin.email);

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
            </nav>

            <form action="/auth/logout" method="post" class="sidebar-footer">
              <p>Sesion: ${email}</p>
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
                <strong class="stat-value" data-count="24">0</strong>
                <small>6 eventos activos esta semana</small>
              </article>
              <article class="stat-card accent-green">
                <span class="stat-label">Total de usuarios</span>
                <strong class="stat-value" data-count="1280">0</strong>
                <small>142 registros nuevos</small>
              </article>
              <article class="stat-card accent-coral">
                <span class="stat-label">Boletas vendidas</span>
                <strong class="stat-value" data-count="8425">0</strong>
                <small>RD$ 3,240,500 generados</small>
              </article>
            </section>

            <section class="content-grid">
              <article class="dashboard-section" id="eventos">
                <div class="section-heading">
                  <div>
                    <p class="eyebrow">Eventos</p>
                    <h2>Proximos eventos</h2>
                  </div>
                  <button type="button" class="compact-button">Nuevo evento</button>
                </div>
                <div class="event-list">
                  <div class="event-row">
                    <div>
                      <strong>Festival Urbano 2026</strong>
                      <span>Estadio Olimpico - 18 mayo</span>
                    </div>
                    <span class="pill">Activo</span>
                  </div>
                  <div class="event-row">
                    <div>
                      <strong>Noche de Merengue</strong>
                      <span>Teatro Nacional - 25 mayo</span>
                    </div>
                    <span class="pill warning">70%</span>
                  </div>
                  <div class="event-row">
                    <div>
                      <strong>Stand Up Premium</strong>
                      <span>Blue Room - 31 mayo</span>
                    </div>
                    <span class="pill">Activo</span>
                  </div>
                </div>
              </article>

              <article class="dashboard-section" id="ventas">
                <div class="section-heading">
                  <div>
                    <p class="eyebrow">Ventas</p>
                    <h2>Resumen mensual</h2>
                  </div>
                </div>
                <div class="sales-bars" aria-label="Ventas por semana">
                  <div style="--bar-height: 48%"><span>Sem 1</span></div>
                  <div style="--bar-height: 72%"><span>Sem 2</span></div>
                  <div style="--bar-height: 56%"><span>Sem 3</span></div>
                  <div style="--bar-height: 88%"><span>Sem 4</span></div>
                </div>
              </article>
            </section>

            <section class="table-section" id="boletas">
              <div class="section-heading">
                <div>
                  <p class="eyebrow">Boletas</p>
                  <h2>Ultimas ventas</h2>
                </div>
                <span class="table-note" id="usuarios">Usuarios verificados</span>
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
                    <tr>
                      <td>Laura Mendez</td>
                      <td>Festival Urbano 2026</td>
                      <td>4</td>
                      <td>RD$ 12,000</td>
                      <td><span class="pill">Pagado</span></td>
                    </tr>
                    <tr>
                      <td>Carlos Perez</td>
                      <td>Noche de Merengue</td>
                      <td>2</td>
                      <td>RD$ 5,600</td>
                      <td><span class="pill">Pagado</span></td>
                    </tr>
                    <tr>
                      <td>Ana Rodriguez</td>
                      <td>Stand Up Premium</td>
                      <td>3</td>
                      <td>RD$ 4,500</td>
                      <td><span class="pill pending">Pendiente</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          </main>
        </div>
      </body>
    </html>
  `);
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
