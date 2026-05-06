const { findUserAppByEmail, findUserAppById, updateUserApp } = require("../models/userAppModel");
const { listPurchasesByUser } = require("../models/purchaseModel");
const { getTicketsByUser, getTicketsByPurchase } = require("../models/ticketModel");
const eventModel = require("../models/eventModel");
const ticketTypeModel = require("../models/ticketTypeModel");

function renderDashboard(req, res) {
  const userEmail = escapeHtml(req.user.email);
  const userName = escapeHtml(req.user.nombre);

  return res.send(`
    <!doctype html>
    <html lang="es">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Mi Cuenta - Eventix</title>
        <link rel="stylesheet" href="/styles.css" />
        <script src="/user-dashboard.js" defer></script>
      </head>
      <body>
        <div class="user-layout">
          <nav class="user-navbar">
            <div class="navbar-content">
              <a href="/user/dashboard" class="navbar-brand">
                <img src="/eventix-logo.svg" alt="Eventix" />
                <span>Eventix</span>
              </a>
              <div class="navbar-links">
                <a href="/user/eventos">Eventos</a>
                <a href="/user/dashboard" class="active">Mis Compras</a>
                <a href="/user/boletos">Mis Boletos</a>
              </div>
              <form action="/user/logout" method="post" style="display: inline;">
                <button type="submit" class="ghost-button">Cerrar sesión</button>
              </form>
            </div>
          </nav>

          <main class="user-main">
            <section class="user-header">
              <div>
                <p class="eyebrow">Bienvenido</p>
                <h1>Hola, ${userName}</h1>
                <p>${userEmail}</p>
              </div>
              <a href="/user/perfil" class="link-button">Editar Perfil</a>
            </section>

            <section class="events-list-panel">
              <div class="section-heading">
                <div>
                  <p class="eyebrow">Tu Actividad</p>
                  <h2>Historial de compras</h2>
                </div>
              </div>

              <div id="purchases-container">
                <p>Cargando compras...</p>
              </div>
            </section>
          </main>
        </div>
      </body>
    </html>
  `);
}

function renderEventsPage(req, res) {
  return res.send(`
    <!doctype html>
    <html lang="es">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Eventos - Eventix</title>
        <link rel="stylesheet" href="/styles.css" />
        <script src="/user-events.js" defer></script>
      </head>
      <body>
        <div class="user-layout">
          <nav class="user-navbar">
            <div class="navbar-content">
              <a href="/user/dashboard" class="navbar-brand">
                <img src="/eventix-logo.svg" alt="Eventix" />
                <span>Eventix</span>
              </a>
              <div class="navbar-links">
                <a href="/user/eventos" class="active">Eventos</a>
                <a href="/user/dashboard">Mis Compras</a>
                <a href="/user/boletos">Mis Boletos</a>
              </div>
              <form action="/user/logout" method="post" style="display: inline;">
                <button type="submit" class="ghost-button">Cerrar sesión</button>
              </form>
            </div>
          </nav>

          <main class="user-main">
            <section class="user-header">
              <div>
                <p class="eyebrow">Compra</p>
                <h1>Eventos Disponibles</h1>
              </div>
            </section>

            <section class="events-list-panel">
              <div class="section-heading">
                <div>
                  <p class="eyebrow">Catálogo</p>
                  <h2>Próximos eventos</h2>
                </div>
              </div>

              <div class="events-grid" id="events-container">
                <p>Cargando eventos...</p>
              </div>
            </section>
          </main>
        </div>
      </body>
    </html>
  `);
}

function renderEventDetailPage(req, res) {
  return res.send(`
    <!doctype html>
    <html lang="es">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Detalle del evento - Eventix</title>
        <link rel="stylesheet" href="/styles.css" />
        <script src="/user-event-detail.js" defer></script>
      </head>
      <body>
        <div class="user-layout" data-event-id="${escapeHtml(req.params.eventoId)}">
          <nav class="user-navbar">
            <div class="navbar-content">
              <a href="/user/dashboard" class="navbar-brand">
                <img src="/eventix-logo.svg" alt="Eventix" />
                <span>Eventix</span>
              </a>
              <div class="navbar-links">
                <a href="/user/eventos" class="active">Eventos</a>
                <a href="/user/dashboard">Mis Compras</a>
                <a href="/user/boletos">Mis Boletos</a>
              </div>
              <form action="/user/logout" method="post" style="display: inline;">
                <button type="submit" class="ghost-button">Cerrar sesión</button>
              </form>
            </div>
          </nav>

          <main class="user-main">
            <section class="user-header event-detail-header" id="event-detail">
              <p>Cargando evento...</p>
            </section>

            <section class="event-form-panel">
              <div class="section-heading">
                <div>
                  <p class="eyebrow">Compra</p>
                  <h2>Selecciona tus boletas</h2>
                </div>
              </div>

              <p class="form-message" id="purchase-message" hidden></p>

              <form id="purchase-form" novalidate>
                <label for="ticket-type">Tipo de boleta</label>
                <select id="ticket-type" name="ticket_type" required></select>

                <label for="ticket-quantity">Cantidad</label>
                <input id="ticket-quantity" name="quantity" type="number" min="1" max="10" value="1" required />

                <div class="ticket-price">
                  Precio total: <span id="total-price">RD$ 0.00</span>
                </div>

                <fieldset class="payment-fieldset">
                  <legend>Datos de pago</legend>

                  <label for="payment-method">Metodo de pago</label>
                  <select id="payment-method" name="payment_method" required>
                    <option value="tarjeta">Tarjeta de credito o debito</option>
                  </select>

                  <label for="cardholder-name">Nombre del titular</label>
                  <input id="cardholder-name" name="cardholder_name" type="text" autocomplete="cc-name" required />

                  <label for="card-number">Numero de tarjeta</label>
                  <input id="card-number" name="card_number" type="text" inputmode="numeric" autocomplete="cc-number" maxlength="23" placeholder="4242 4242 4242 4242" required />

                  <div class="payment-grid">
                    <div>
                      <label for="card-expiry">Expiracion</label>
                      <input id="card-expiry" name="card_expiry" type="text" inputmode="numeric" autocomplete="cc-exp" maxlength="5" placeholder="MM/AA" required />
                    </div>
                    <div>
                      <label for="card-cvv">CVV</label>
                      <input id="card-cvv" name="card_cvv" type="password" inputmode="numeric" autocomplete="cc-csc" maxlength="4" required />
                    </div>
                  </div>
                </fieldset>

                <button type="submit" class="primary-button">Comprar boletas</button>
              </form>
            </section>
          </main>
        </div>
      </body>
    </html>
  `);
}

function renderTicketsPage(req, res) {
  return res.send(`
    <!doctype html>
    <html lang="es">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Mis Boletos - Eventix</title>
        <link rel="stylesheet" href="/styles.css" />
        <script src="/user-tickets.js" defer></script>
      </head>
      <body>
        <div class="user-layout">
          <nav class="user-navbar">
            <div class="navbar-content">
              <a href="/user/dashboard" class="navbar-brand">
                <img src="/eventix-logo.svg" alt="Eventix" />
                <span>Eventix</span>
              </a>
              <div class="navbar-links">
                <a href="/user/eventos">Eventos</a>
                <a href="/user/dashboard">Mis Compras</a>
                <a href="/user/boletos" class="active">Mis Boletos</a>
              </div>
              <form action="/user/logout" method="post" style="display: inline;">
                <button type="submit" class="ghost-button">Cerrar sesión</button>
              </form>
            </div>
          </nav>

          <main class="user-main">
            <section class="user-header">
              <div>
                <p class="eyebrow">Tus Boletos</p>
                <h1>Mis Entradas</h1>
              </div>
            </section>

            <section class="events-list-panel">
              <div class="section-heading">
                <p class="eyebrow">Tickets Activos</p>
                <h2>Boletos Disponibles</h2>
              </div>

              <div id="tickets-container">
                <p>Cargando boletos...</p>
              </div>
            </section>
          </main>
        </div>
      </body>
    </html>
  `);
}

function renderProfilePage(req, res) {
  return res.send(`
    <!doctype html>
    <html lang="es">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Mi Perfil - Eventix</title>
        <link rel="stylesheet" href="/styles.css" />
        <script src="/user-profile.js" defer></script>
      </head>
      <body>
        <div class="user-layout">
          <nav class="user-navbar">
            <div class="navbar-content">
              <a href="/user/dashboard" class="navbar-brand">
                <img src="/eventix-logo.svg" alt="Eventix" />
                <span>Eventix</span>
              </a>
              <div class="navbar-links">
                <a href="/user/eventos">Eventos</a>
                <a href="/user/dashboard">Mis Compras</a>
                <a href="/user/boletos">Mis Boletos</a>
              </div>
              <form action="/user/logout" method="post" style="display: inline;">
                <button type="submit" class="ghost-button">Cerrar sesión</button>
              </form>
            </div>
          </nav>

          <main class="user-main">
            <section class="user-header">
              <div>
                <p class="eyebrow">Configuración</p>
                <h1>Mi Perfil</h1>
              </div>
            </section>

            <section class="event-form-panel">
              <form id="profile-form">
                <p class="form-message" id="profile-message" hidden></p>

                <label for="nombre">Nombre Completo</label>
                <input id="nombre" name="nombre" type="text" required />

                <label for="email">Email</label>
                <input id="email" name="email" type="email" required />

                <label for="telefono">Teléfono</label>
                <input id="telefono" name="telefono" type="tel" />

                <button type="submit" class="primary-button">Guardar Cambios</button>
              </form>
            </section>
          </main>
        </div>
      </body>
    </html>
  `);
}

async function getPublicEvents(req, res, next) {
  try {
    const events = await eventModel.listEvents();
    return res.json({
      events: events.filter((event) => event.estado === "activo"),
    });
  } catch (error) {
    return next(error);
  }
}

async function getPublicEvent(req, res, next) {
  try {
    const event = await eventModel.findEventById(req.params.eventoId);

    if (!event || event.estado !== "activo") {
      return res.status(404).json({ message: "Evento no disponible." });
    }

    return res.json({ event });
  } catch (error) {
    return next(error);
  }
}

async function getEventTicketTypes(req, res, next) {
  try {
    const ticketTypes = await ticketTypeModel.listTicketTypesByEvent(req.params.eventoId);
    return res.json({
      ticketTypes: ticketTypes.filter(
        (ticketType) => Number(ticketType.cantidad_disponible) > 0
      ),
    });
  } catch (error) {
    return next(error);
  }
}

async function getUserPurchases(req, res, next) {
  try {
    const purchases = await listPurchasesByUser(req.user.id);
    return res.json({ purchases });
  } catch (error) {
    return next(error);
  }
}

async function getUserTickets(req, res, next) {
  try {
    const tickets = await getTicketsByUser(req.user.id);
    return res.json({ tickets });
  } catch (error) {
    return next(error);
  }
}

async function getUserProfile(req, res, next) {
  try {
    const user = await findUserAppById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    return res.json({ user });
  } catch (error) {
    return next(error);
  }
}

async function updateUserProfile(req, res, next) {
  try {
    const { nombre, email, telefono } = req.body;

    // Verificar si el email ya está en uso por otro usuario
    if (email !== req.user.email) {
      const existingUser = await findUserAppByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "Este email ya está registrado." });
      }
    }

    const updatedUser = await updateUserApp(req.user.id, {
      nombre,
      email,
      telefono,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    return res.json({
      message: "Perfil actualizado correctamente.",
      user: updatedUser,
    });
  } catch (error) {
    return next(error);
  }
}

function escapeHtml(str) {
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return str.replace(/[&<>"']/g, (m) => map[m]);
}

module.exports = {
  renderDashboard,
  renderEventsPage,
  renderEventDetailPage,
  renderTicketsPage,
  renderProfilePage,
  getPublicEvents,
  getPublicEvent,
  getEventTicketTypes,
  getUserPurchases,
  getUserTickets,
  getUserProfile,
  updateUserProfile,
};
