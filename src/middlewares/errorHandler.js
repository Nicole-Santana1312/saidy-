const { wantsHtml } = require("../utils/requestFormat");

function notFound(req, res, next) {
  const error = new Error(`Ruta no encontrada: ${req.originalUrl}`);
  error.status = 404;
  next(error);
}

function errorHandler(error, req, res, next) {
  const status = error.status || 500;
  const message =
    status === 500 && process.env.NODE_ENV === "production"
      ? "Error interno del servidor."
      : error.message;

  console.error(error);

  if (wantsHtml(req)) {
    return res
      .status(status)
      .send(`
        <!doctype html>
        <html lang="es">
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>${status} - Eventix</title>
            <link rel="stylesheet" href="/styles.css" />
            <style>
              .error-shell {
                min-height: 100vh;
                display: grid;
                place-items: center;
                padding: 28px;
                background: #f7f4ef;
                color: #172026;
              }

              .error-panel {
                width: min(100%, 560px);
                padding: 36px;
                border: 1px solid rgba(18, 49, 59, 0.12);
                border-radius: 8px;
                background: #ffffff;
                box-shadow: 0 24px 70px rgba(18, 49, 59, 0.12);
              }

              .error-panel img {
                width: 70px;
                display: block;
                margin-bottom: 22px;
              }

              .error-panel strong {
                color: #0f6379;
                letter-spacing: 0.08em;
                text-transform: uppercase;
                font-size: 0.78rem;
              }

              .error-panel h1 {
                margin: 12px 0;
                color: #12313b;
                font-size: clamp(2.4rem, 8vw, 4.5rem);
                letter-spacing: 0;
              }

              .error-panel p {
                color: #56656c;
                line-height: 1.65;
              }

              .error-panel a {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                min-height: 46px;
                margin-top: 18px;
                padding: 0 18px;
                border-radius: 8px;
                background: #0f6379;
                color: #ffffff;
                font-weight: 800;
              }
            </style>
          </head>
          <body>
            <main class="error-shell">
              <section class="error-panel">
                <img src="/eventix-logo.svg" alt="Eventix" />
                <strong>Algo necesita atencion</strong>
                <h1>${status}</h1>
                <p>${escapeHtml(message)}</p>
                <a href="/home">Volver al inicio</a>
              </section>
            </main>
          </body>
        </html>
      `);
  }

  return res.status(status).json({ message });
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
  notFound,
  errorHandler,
};
