function renderCheckinPage(req, res) {
  return res.send(`
    <!doctype html>
    <html lang="es">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Check-in de Boletos - Eventix</title>
        <link rel="stylesheet" href="/styles.css" />
        <script src="/admin-checkin.js" defer></script>
      </head>
      <body>
        <main class="events-page">
          <header class="events-header">
            <div>
              <p class="eyebrow">Administración</p>
              <h1>Validación de Boletos</h1>
            </div>
            <a class="link-button" href="/admin/dashboard">Volver al dashboard</a>
          </header>

          <section class="event-form-panel">
            <div class="section-heading">
              <p class="eyebrow">Escáner</p>
              <h2>Validar Boleto</h2>
            </div>

            <p class="form-message" id="checkin-message" hidden></p>

            <form id="checkin-form" novalidate>
              <label for="codigo_boleto">Código del Boleto o QR</label>
              <input id="codigo_boleto" name="codigo" type="text" placeholder="Ingresa el código aquí" required autofocus />

              <button type="submit" class="primary-button">Validar</button>
            </form>
          </section>

          <section class="events-list-panel">
            <div class="section-heading">
              <p class="eyebrow">Resultado</p>
              <h2>Información del Boleto</h2>
            </div>

            <div id="ticket-info" style="display: none;">
              <article class="ticket-card">
                <div class="ticket-header">
                  <span class="ticket-type" id="info-tipo">-</span>
                  <span class="ticket-status" id="info-estado">-</span>
                </div>
                <div class="ticket-details">
                  <p><strong>Usuario:</strong> <span id="info-usuario">-</span></p>
                  <p><strong>Email:</strong> <span id="info-email">-</span></p>
                  <p><strong>Evento:</strong> <span id="info-evento">-</span></p>
                  <p><strong>Fecha evento:</strong> <span id="info-fecha">-</span></p>
                  <p><strong>Lugar:</strong> <span id="info-lugar">-</span></p>
                  <p><strong>Tipo:</strong> <span id="info-boleta-tipo">-</span></p>
                  <p><strong>Asiento:</strong> Fila <span id="info-fila">-</span>, asiento <span id="info-asiento">-</span></p>
                  <p><strong>Código:</strong> <code id="info-codigo">-</code></p>
                  <p><strong>Validado en:</strong> <span id="info-validacion">-</span></p>
                </div>
              </article>
            </div>
          </section>
        </main>
      </body>
    </html>
  `);
}

module.exports = {
  renderCheckinPage,
};
