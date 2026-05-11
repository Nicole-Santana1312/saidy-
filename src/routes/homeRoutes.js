const express = require("express");

const router = express.Router();

router.get("/home", (req, res) => {
  return res.send(`
    <!doctype html>
    <html lang="es">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Eventix - Eventos, boletas y acceso</title>
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body class="home-page">
        <header class="home-nav">
          <a class="home-brand" href="/home">
            <img src="/eventix-logo.svg" alt="Eventix" />
            <span>Eventix</span>
          </a>
          <nav class="home-links" aria-label="Navegacion principal">
            <a href="#experiencia">Experiencia</a>
            <a href="#gestion">Gestion</a>
            <a href="/login">Iniciar sesion</a>
            <a class="home-nav-action" href="/user/eventos">Ver eventos</a>
          </nav>
        </header>

        <main>
          <section class="home-hero">
            <div class="home-hero-copy">
              <p class="home-kicker">Boletas digitales para eventos memorables</p>
              <h1>Compra, organiza y presenta tus entradas con una experiencia elegante.</h1>
              <p>
                Eventix conecta a los asistentes con eventos disponibles y da al equipo
                administrativo un panel claro para gestionar ventas, boletas y accesos.
              </p>
              <div class="home-actions">
                <a class="home-primary" href="/user/eventos">Comprar boletas</a>
                <a class="home-secondary" href="/user/register">Crear cuenta</a>
              </div>
            </div>

            <aside class="home-showcase" aria-label="Evento destacado">
              <div class="home-showcase-photo">
                <div class="home-ticket">
                  <span>Evento destacado</span>
                  <strong>Noches en vivo</strong>
                  <small>Acceso con QR digital</small>
                </div>
              </div>
              <div class="home-metrics" aria-label="Beneficios">
                <div>
                  <strong>QR</strong>
                  <span>Entrada lista</span>
                </div>
                <div>
                  <strong>24/7</strong>
                  <span>Consulta online</span>
                </div>
                <div>
                  <strong>Panel</strong>
                  <span>Gestion central</span>
                </div>
              </div>
            </aside>
          </section>

          <section id="experiencia" class="home-section">
            <div class="home-section-heading">
              <p class="home-kicker">Experiencia</p>
              <h2>Una compra simple, visual y confiable.</h2>
              <p>
                Diseñado para que el usuario encuentre eventos, elija su boleta
                y conserve sus entradas sin pasos confusos.
              </p>
            </div>
            <div class="home-feature-grid">
              <article>
                <span>01</span>
                <h3>Explora eventos</h3>
                <p>Consulta fechas, lugares, imagenes y disponibilidad desde un catalogo limpio.</p>
              </article>
              <article>
                <span>02</span>
                <h3>Compra tus entradas</h3>
                <p>Selecciona tipo de boleta, cantidad y datos de pago desde una vista enfocada.</p>
              </article>
              <article>
                <span>03</span>
                <h3>Guarda tus boletos</h3>
                <p>Accede a tus compras y presenta tus tickets con codigo QR cuando los necesites.</p>
              </article>
            </div>
          </section>

          <section id="gestion" class="home-split">
            <div class="home-split-media" aria-hidden="true"></div>
            <div class="home-split-copy">
              <p class="home-kicker">Gestion profesional</p>
              <h2>Un panel administrativo que se siente serio desde el primer vistazo.</h2>
              <p>
                Administra eventos, tipos de boletas, usuarios, ventas, reportes
                y check-in desde una interfaz consistente, sobria y preparada para crecer.
              </p>
            </div>
          </section>

          <section class="home-cta">
            <div>
              <p class="home-kicker">Eventix</p>
              <h2>Tu proximo evento empieza con una entrada bien presentada.</h2>
            </div>
            <a class="home-primary" href="/user/eventos">Explorar eventos</a>
          </section>
        </main>

        <footer class="home-footer">
          <strong>Eventix</strong>
          <span>&copy; 2026 Xiomara Santana y Nayelis Morel. Todos los derechos reservados.</span>
          <a href="/user/eventos">Ver eventos</a>
        </footer>
      </body>
    </html>
  `);
});

module.exports = router;
