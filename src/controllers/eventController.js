const eventModel = require("../models/eventModel");

async function renderEventsPage(req, res) {
  return res.send(`
    <!doctype html>
    <html lang="es">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Eventos - Eventix</title>
        <link rel="stylesheet" href="/styles.css" />
        <script src="/events.js" defer></script>
      </head>
      <body>
        <main class="events-page">
          <header class="events-header">
            <div>
              <p class="eyebrow">Administracion</p>
              <h1>CRUD de eventos</h1>
            </div>
            <a class="link-button" href="/admin/dashboard">Volver al dashboard</a>
          </header>

          <section class="event-form-panel">
            <div class="section-heading">
              <div>
                <p class="eyebrow">Formulario</p>
                <h2 id="form-title">Crear evento</h2>
              </div>
              <button class="compact-button secondary" type="button" data-reset-form>Limpiar</button>
            </div>

            <p class="form-message" data-form-message hidden></p>

            <form class="event-form" data-event-form novalidate>
              <input type="hidden" name="id" />

              <label for="nombre">Nombre</label>
              <input id="nombre" name="nombre" type="text" maxlength="120" required />

              <label for="fecha">Fecha</label>
              <input id="fecha" name="fecha" type="date" required />

              <label for="lugar">Lugar</label>
              <input id="lugar" name="lugar" type="text" maxlength="160" required />

              <label for="imagen">Imagen URL</label>
              <input id="imagen" name="imagen" type="url" placeholder="https://ejemplo.com/evento.jpg" required />

              <label for="descripcion">Descripcion</label>
              <textarea id="descripcion" name="descripcion" rows="4" maxlength="1000" required></textarea>

              <button type="submit" data-submit-button>Guardar evento</button>
            </form>
          </section>

          <section class="events-list-panel">
            <div class="section-heading">
              <div>
                <p class="eyebrow">Registros SQL</p>
                <h2>Eventos guardados</h2>
              </div>
            </div>
            <div class="events-grid" data-events-list></div>
          </section>
        </main>
      </body>
    </html>
  `);
}

async function listEvents(req, res, next) {
  try {
    const events = await eventModel.listEvents();
    return res.json({ events });
  } catch (error) {
    return next(error);
  }
}

async function getEvent(req, res, next) {
  try {
    const event = await eventModel.findEventById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Evento no encontrado." });
    }

    return res.json({ event });
  } catch (error) {
    return next(error);
  }
}

async function createEvent(req, res, next) {
  try {
    const event = await eventModel.createEvent(req.body);
    return res.status(201).json({
      message: "Evento creado correctamente.",
      event,
    });
  } catch (error) {
    return next(error);
  }
}

async function updateEvent(req, res, next) {
  try {
    const event = await eventModel.updateEvent(req.params.id, req.body);

    if (!event) {
      return res.status(404).json({ message: "Evento no encontrado." });
    }

    return res.json({
      message: "Evento actualizado correctamente.",
      event,
    });
  } catch (error) {
    return next(error);
  }
}

async function deleteEvent(req, res, next) {
  try {
    const wasDeleted = await eventModel.deleteEvent(req.params.id);

    if (!wasDeleted) {
      return res.status(404).json({ message: "Evento no encontrado." });
    }

    return res.json({ message: "Evento eliminado correctamente." });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  renderEventsPage,
  listEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
};
