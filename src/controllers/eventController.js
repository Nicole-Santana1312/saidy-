const eventService = require("../services/eventService");

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

              <label for="hora">Hora</label>
              <input id="hora" name="hora" type="time" required />

              <label for="lugar">Lugar</label>
              <input id="lugar" name="lugar" type="text" maxlength="160" required />

              <label for="categoria">Categoria</label>
              <select id="categoria" name="categoria" required>
                <option value="concierto">Concierto</option>
                <option value="stand_up">Stand up</option>
                <option value="actividad">Actividad</option>
              </select>

              <label for="estado">Estado</label>
              <select id="estado" name="estado" required>
                <option value="activo">Activo</option>
                <option value="pausado">Pausado</option>
                <option value="finalizado">Finalizado</option>
              </select>

              <label for="imagen">Imagen</label>
              <div class="image-picker">
                <input id="imagen" name="imagen" type="text" placeholder="https://ejemplo.com/evento.jpg" />
                <label class="compact-button secondary image-picker-button" for="imagen_archivo">Escoger de la PC</label>
                <input id="imagen_archivo" name="imagen_archivo" type="file" accept="image/*" data-image-file hidden />
              </div>
              <img class="image-preview" data-image-preview alt="Vista previa" hidden />

              <label for="descripcion">Descripcion</label>
              <textarea id="descripcion" name="descripcion" rows="4" maxlength="1000" required></textarea>

              <div class="ticket-inline-section" data-ticket-inline-section>
                <div class="section-heading">
                  <div>
                    <p class="eyebrow">Boleteria</p>
                    <h2>Tipos y precios</h2>
                  </div>
                  <button class="compact-button secondary" type="button" data-add-ticket-row>Agregar tipo</button>
                </div>
                <div class="ticket-inline-list" data-ticket-rows></div>
              </div>

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
    const events = await eventService.listEvents();
    return res.json({ events });
  } catch (error) {
    return next(error);
  }
}

async function getEvent(req, res, next) {
  try {
    const event = await eventService.findEventById(req.params.id);

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
    const { event, ticketTypes } = await eventService.createEventWithTickets(req.body);

    return res.status(201).json({
      message: "Evento y boletas creados correctamente.",
      event,
      ticketTypes,
    });
  } catch (error) {
    return next(error);
  }
}

async function updateEvent(req, res, next) {
  try {
    const event = await eventService.updateEvent(req.params.id, req.body);

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
    const wasDeleted = await eventService.deleteEvent(req.params.id);

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
