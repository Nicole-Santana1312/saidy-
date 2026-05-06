const ticketTypeModel = require("../models/ticketTypeModel");

async function renderTicketTypesPage(req, res) {
  return res.send(`
    <!doctype html>
    <html lang="es">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Tipos de boletas - Eventix</title>
        <link rel="stylesheet" href="/styles.css" />
        <script src="/ticket-types.js" defer></script>
      </head>
      <body>
        <main class="events-page">
          <header class="events-header">
            <div>
              <p class="eyebrow">Administracion</p>
              <h1>Tipos de boletas</h1>
            </div>
            <a class="link-button" href="/admin/dashboard">Volver al dashboard</a>
          </header>

          <section class="event-form-panel">
            <div class="section-heading">
              <div>
                <p class="eyebrow">Formulario</p>
                <h2 id="ticket-form-title">Crear tipo de boleta</h2>
              </div>
              <button class="compact-button secondary" type="button" data-reset-ticket-form>Limpiar</button>
            </div>

            <p class="form-message" data-ticket-message hidden></p>

            <form class="event-form" data-ticket-form novalidate>
              <input type="hidden" name="id" />

              <label for="evento_id">Evento</label>
              <select id="evento_id" name="evento_id" required data-event-select></select>

              <label for="tipo">Tipo</label>
              <input id="tipo" name="tipo" type="text" maxlength="60" list="tipos-sugeridos" placeholder="General, VIP, Platinum" required />
              <datalist id="tipos-sugeridos">
                <option value="General"></option>
                <option value="VIP"></option>
                <option value="Platinum"></option>
              </datalist>

              <label for="precio">Precio</label>
              <input id="precio" name="precio" type="number" min="0" step="0.01" required />

              <label for="cantidad_disponible">Cantidad disponible</label>
              <input id="cantidad_disponible" name="cantidad_disponible" type="number" min="0" step="1" required />

              <button type="submit" data-ticket-submit>Guardar boleta</button>
            </form>
          </section>

          <section class="events-list-panel">
            <div class="section-heading">
              <div>
                <p class="eyebrow">Relacion por evento</p>
                <h2>Boletas del evento seleccionado</h2>
              </div>
              <select class="filter-select" data-event-filter aria-label="Filtrar por evento"></select>
            </div>
            <div class="ticket-type-grid" data-ticket-list></div>
          </section>
        </main>
      </body>
    </html>
  `);
}

async function listTicketTypesByEvent(req, res, next) {
  try {
    const ticketTypes = await ticketTypeModel.listTicketTypesByEvent(
      req.params.eventoId
    );

    return res.json({ ticketTypes });
  } catch (error) {
    return next(error);
  }
}

async function getTicketType(req, res, next) {
  try {
    const ticketType = await ticketTypeModel.findTicketTypeById(req.params.id);

    if (!ticketType) {
      return res.status(404).json({ message: "Tipo de boleta no encontrado." });
    }

    return res.json({ ticketType });
  } catch (error) {
    return next(error);
  }
}

async function createTicketType(req, res, next) {
  try {
    const ticketType = await ticketTypeModel.createTicketType(req.body);

    return res.status(201).json({
      message: "Tipo de boleta creado correctamente.",
      ticketType,
    });
  } catch (error) {
    return next(error);
  }
}

async function updateTicketType(req, res, next) {
  try {
    const ticketType = await ticketTypeModel.updateTicketType(
      req.params.id,
      req.body
    );

    if (!ticketType) {
      return res.status(404).json({ message: "Tipo de boleta no encontrado." });
    }

    return res.json({
      message: "Tipo de boleta actualizado correctamente.",
      ticketType,
    });
  } catch (error) {
    return next(error);
  }
}

async function deleteTicketType(req, res, next) {
  try {
    const wasDeleted = await ticketTypeModel.deleteTicketType(req.params.id);

    if (!wasDeleted) {
      return res.status(404).json({ message: "Tipo de boleta no encontrado." });
    }

    return res.json({ message: "Tipo de boleta eliminado correctamente." });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  renderTicketTypesPage,
  listTicketTypesByEvent,
  getTicketType,
  createTicketType,
  updateTicketType,
  deleteTicketType,
};
