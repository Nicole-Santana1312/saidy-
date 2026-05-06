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
        <style>
          body.home-page {
            color: #18252b;
            background: #f5f7f2;
          }

          .home-page a:hover {
            text-decoration: none;
          }

          .landing {
            min-height: 100vh;
            background: #f5f7f2;
          }

          .topbar {
            position: sticky;
            top: 0;
            z-index: 20;
            border-bottom: 1px solid rgba(24, 37, 43, 0.08);
            background: rgba(245, 247, 242, 0.9);
            backdrop-filter: blur(16px);
          }

          .nav {
            width: min(1180px, calc(100% - 40px));
            min-height: 78px;
            margin: 0 auto;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 22px;
          }

          .brand {
            display: inline-flex;
            align-items: center;
            gap: 12px;
            color: #12272d;
            font-size: 1.08rem;
            font-weight: 900;
          }

          .brand img {
            width: 44px;
            height: auto;
          }

          .nav-links {
            display: flex;
            align-items: center;
            gap: 8px;
            flex-wrap: wrap;
          }

          .nav-links a {
            color: #435158;
            padding: 10px 12px;
            border-radius: 8px;
            font-weight: 800;
            font-size: 0.94rem;
          }

          .nav-links a:hover {
            color: #0c6372;
            background: #ffffff;
          }

          .nav-action {
            color: #ffffff !important;
            background: #12272d;
          }

          .hero {
            width: min(1180px, calc(100% - 40px));
            margin: 0 auto;
            display: grid;
            grid-template-columns: minmax(0, 0.94fr) minmax(380px, 1.06fr);
            gap: 34px;
            align-items: stretch;
            padding: 38px 0 28px;
          }

          .hero-copy {
            min-height: 650px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding: 54px 0;
          }

          .eyeline {
            width: fit-content;
            margin: 0 0 18px;
            padding: 9px 13px;
            border: 1px solid rgba(12, 99, 114, 0.18);
            border-radius: 999px;
            color: #0c6372;
            background: #ffffff;
            font-size: 0.78rem;
            font-weight: 900;
            letter-spacing: 0.08em;
            text-transform: uppercase;
          }

          .hero h1 {
            margin: 0;
            color: #12272d;
            font-size: clamp(3.2rem, 6.6vw, 6.2rem);
            line-height: 0.96;
            letter-spacing: 0;
          }

          .hero h1 span {
            color: #0c6372;
          }

          .hero-text {
            max-width: 590px;
            margin: 24px 0 0;
            color: #566268;
            font-size: 1.1rem;
            line-height: 1.75;
          }

          .actions {
            display: flex;
            gap: 12px;
            flex-wrap: wrap;
            margin-top: 34px;
          }

          .button-primary,
          .button-secondary {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-height: 50px;
            padding: 0 22px;
            border-radius: 8px;
            font-weight: 900;
          }

          .button-primary {
            color: #ffffff;
            background: #0c6372;
            box-shadow: 0 18px 44px rgba(12, 99, 114, 0.22);
          }

          .button-primary:hover {
            color: #ffffff;
            background: #094f5b;
          }

          .button-secondary {
            color: #12272d;
            border: 1px solid rgba(18, 39, 45, 0.16);
            background: #ffffff;
          }

          .hero-meta {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 12px;
            margin-top: 46px;
          }

          .meta-item {
            padding: 18px 16px;
            border-left: 3px solid #d4a63a;
            background: rgba(255, 255, 255, 0.72);
          }

          .meta-item strong {
            display: block;
            color: #12272d;
            font-size: 1.28rem;
            line-height: 1;
          }

          .meta-item span {
            display: block;
            margin-top: 8px;
            color: #627078;
            font-size: 0.9rem;
            line-height: 1.35;
          }

          .hero-media {
            min-height: 650px;
            display: grid;
            grid-template-rows: 1fr auto;
            gap: 14px;
          }

          .media-main {
            position: relative;
            min-height: 500px;
            overflow: hidden;
            border-radius: 8px;
            background-image:
              linear-gradient(180deg, rgba(18, 39, 45, 0.02) 35%, rgba(18, 39, 45, 0.86)),
              url("https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1200&q=82");
            background-size: cover;
            background-position: center;
            box-shadow: 0 30px 80px rgba(18, 39, 45, 0.18);
          }

          .event-ticket {
            position: absolute;
            left: 22px;
            right: 22px;
            bottom: 22px;
            display: grid;
            grid-template-columns: 1fr auto;
            gap: 20px;
            align-items: end;
            padding: 22px;
            border: 1px solid rgba(255, 255, 255, 0.22);
            border-radius: 8px;
            color: #ffffff;
            background: rgba(13, 31, 37, 0.72);
            backdrop-filter: blur(12px);
          }

          .event-ticket p,
          .event-ticket h2 {
            margin: 0;
          }

          .event-ticket p {
            color: #cfe5e9;
            font-weight: 800;
            font-size: 0.82rem;
            letter-spacing: 0.08em;
            text-transform: uppercase;
          }

          .event-ticket h2 {
            margin-top: 8px;
            color: #ffffff;
            font-size: clamp(1.6rem, 3vw, 2.5rem);
            line-height: 1;
          }

          .ticket-code {
            min-width: 112px;
            min-height: 112px;
            display: grid;
            place-items: center;
            border-radius: 8px;
            color: #12272d;
            background:
              linear-gradient(90deg, #12272d 12px, transparent 12px) 0 0 / 22px 22px,
              linear-gradient(#12272d 12px, transparent 12px) 0 0 / 22px 22px,
              #ffffff;
            font-weight: 900;
            font-size: 0.8rem;
          }

          .media-strip {
            display: grid;
            grid-template-columns: 0.82fr 1.18fr;
            gap: 14px;
          }

          .strip-card {
            min-height: 136px;
            border-radius: 8px;
            overflow: hidden;
            background-size: cover;
            background-position: center;
          }

          .strip-card:first-child {
            background-image: url("https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=700&q=82");
          }

          .strip-card:last-child {
            padding: 22px;
            color: #12272d;
            background:
              linear-gradient(135deg, rgba(244, 202, 87, 0.94), rgba(255, 255, 255, 0.86)),
              url("https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=700&q=82");
            background-size: cover;
            background-position: center;
          }

          .strip-card strong {
            display: block;
            max-width: 230px;
            font-size: 1.4rem;
            line-height: 1.05;
          }

          .section {
            background: #ffffff;
          }

          .section.soft {
            background: #edf5f2;
          }

          .inner {
            width: min(1180px, calc(100% - 40px));
            margin: 0 auto;
            padding: 82px 0;
          }

          .section-heading {
            display: grid;
            grid-template-columns: minmax(0, 0.9fr) minmax(280px, 0.6fr);
            gap: 34px;
            align-items: end;
            margin-bottom: 34px;
          }

          .section-heading h2 {
            margin: 0;
            color: #12272d;
            font-size: clamp(2.3rem, 4.6vw, 4.6rem);
            line-height: 0.98;
            letter-spacing: 0;
          }

          .section-heading p {
            margin: 0;
            color: #5b686f;
            line-height: 1.7;
            font-size: 1.02rem;
          }

          .service-grid {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 16px;
          }

          .service {
            min-height: 260px;
            padding: 26px;
            border: 1px solid rgba(18, 39, 45, 0.1);
            border-radius: 8px;
            background: #ffffff;
          }

          .service-number {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 42px;
            height: 42px;
            margin-bottom: 34px;
            border-radius: 50%;
            color: #12272d;
            background: #f0c24d;
            font-weight: 900;
          }

          .service h3 {
            margin: 0;
            color: #12272d;
            font-size: 1.28rem;
          }

          .service p {
            margin: 12px 0 0;
            color: #5b686f;
            line-height: 1.65;
          }

          .about {
            display: grid;
            grid-template-columns: minmax(300px, 0.82fr) minmax(0, 1.18fr);
            gap: 42px;
            align-items: center;
          }

          .about-image {
            min-height: 500px;
            border-radius: 8px;
            background-image:
              linear-gradient(180deg, rgba(18, 39, 45, 0.04), rgba(18, 39, 45, 0.18)),
              url("https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1000&q=82");
            background-size: cover;
            background-position: center;
          }

          .about-copy h2 {
            margin: 0;
            color: #12272d;
            font-size: clamp(2.3rem, 4vw, 4.2rem);
            line-height: 1;
          }

          .about-copy p {
            margin: 18px 0 0;
            color: #5b686f;
            line-height: 1.75;
            font-size: 1.05rem;
          }

          .statement {
            margin-top: 28px;
            padding: 26px;
            border-left: 4px solid #0c6372;
            background: #ffffff;
          }

          .statement strong {
            color: #12272d;
            font-size: 1.2rem;
            line-height: 1.45;
          }

          .cta-band {
            color: #ffffff;
            background:
              linear-gradient(90deg, rgba(18, 39, 45, 0.9), rgba(12, 99, 114, 0.78)),
              url("https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1800&q=82");
            background-size: cover;
            background-position: center;
          }

          .cta-band .inner {
            min-height: 370px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 30px;
          }

          .cta-band h2 {
            max-width: 700px;
            margin: 0;
            color: #ffffff;
            font-size: clamp(2.4rem, 5vw, 5rem);
            line-height: 0.98;
            letter-spacing: 0;
          }

          .cta-band p {
            max-width: 430px;
            margin: 18px 0 0;
            color: #d9ecef;
            line-height: 1.7;
          }

          .footer {
            color: #d6e3e6;
            background: #12272d;
          }

          .footer .inner {
            padding: 30px 0;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 18px;
            flex-wrap: wrap;
          }

          .footer a {
            color: #f0c24d;
            font-weight: 900;
          }

          @media (max-width: 980px) {
            .hero,
            .section-heading,
            .about {
              grid-template-columns: 1fr;
            }

            .hero-copy,
            .hero-media {
              min-height: auto;
            }

            .hero-copy {
              padding: 34px 0 12px;
            }

            .service-grid {
              grid-template-columns: 1fr;
            }

            .cta-band .inner {
              align-items: flex-start;
              flex-direction: column;
            }
          }

          @media (max-width: 660px) {
            .nav {
              min-height: auto;
              padding: 16px 0;
              align-items: flex-start;
              flex-direction: column;
            }

            .nav-links {
              width: 100%;
            }

            .nav-links a {
              padding-left: 0;
            }

            .nav-action {
              width: 100%;
              padding-left: 12px !important;
              text-align: center;
            }

            .hero {
              width: min(100% - 28px, 1180px);
              padding-top: 24px;
            }

            .hero h1 {
              font-size: clamp(2.7rem, 14vw, 4.6rem);
            }

            .actions,
            .hero-meta,
            .media-strip {
              grid-template-columns: 1fr;
              display: grid;
            }

            .button-primary,
            .button-secondary {
              width: 100%;
            }

            .media-main,
            .about-image {
              min-height: 380px;
            }

            .event-ticket {
              grid-template-columns: 1fr;
            }

            .ticket-code {
              display: none;
            }

            .inner {
              width: min(100% - 28px, 1180px);
              padding: 58px 0;
            }
          }
        </style>
      </head>
      <body class="home-page">
        <div class="landing">
          <header class="topbar">
            <nav class="nav" aria-label="Navegacion principal">
              <a class="brand" href="/home">
                <img src="/eventix-logo.svg" alt="Eventix" />
                <span>Eventix</span>
              </a>
              <div class="nav-links">
                <a href="#servicios">Servicios</a>
                <a href="#nosotros">Nosotros</a>
                <a href="/login">Admin</a>
                <a class="nav-action" href="/user/eventos">Ver eventos</a>
              </div>
            </nav>
          </header>

          <main class="hero">
            <section class="hero-copy">
              <p class="eyeline">Plataforma de eventos</p>
              <h1>Vende boletas y controla accesos <span>sin desorden.</span></h1>
              <p class="hero-text">
                Eventix ayuda a organizadores a publicar eventos, gestionar entradas,
                vender tickets y validar asistentes desde un sistema claro, moderno y confiable.
              </p>
              <div class="actions">
                <a class="button-primary" href="/user/eventos">Comprar boletas</a>
                <a class="button-secondary" href="/user/register">Crear cuenta</a>
              </div>
              <div class="hero-meta" aria-label="Beneficios principales">
                <div class="meta-item">
                  <strong>QR</strong>
                  <span>Validacion rapida en la entrada</span>
                </div>
                <div class="meta-item">
                  <strong>Panel</strong>
                  <span>Ventas, usuarios y reportes en un lugar</span>
                </div>
                <div class="meta-item">
                  <strong>Online</strong>
                  <span>Boletas disponibles en cualquier momento</span>
                </div>
              </div>
            </section>

            <aside class="hero-media" aria-label="Evento destacado">
              <div class="media-main">
                <div class="event-ticket">
                  <div>
                    <p>Experiencia destacada</p>
                    <h2>Eventos con entrada mas agil y ventas mejor organizadas.</h2>
                  </div>
                  <div class="ticket-code" aria-hidden="true">CHECK-IN</div>
                </div>
              </div>
              <div class="media-strip">
                <div class="strip-card" aria-hidden="true"></div>
                <div class="strip-card">
                  <strong>Todo listo antes de abrir las puertas.</strong>
                </div>
              </div>
            </aside>
          </main>
        </div>

        <section id="servicios" class="section">
          <div class="inner">
            <div class="section-heading">
              <h2>Una operacion completa para tus eventos.</h2>
              <p>
                Desde la publicacion hasta la entrada, Eventix organiza el flujo
                principal para que el equipo trabaje con informacion clara.
              </p>
            </div>
            <div class="service-grid">
              <article class="service">
                <span class="service-number">1</span>
                <h3>Publicacion y boletas</h3>
                <p>Crea eventos, configura categorias de tickets y muestra la informacion importante de forma limpia.</p>
              </article>
              <article class="service">
                <span class="service-number">2</span>
                <h3>Compras para usuarios</h3>
                <p>Los asistentes pueden crear cuenta, comprar entradas y consultar sus boletas desde su perfil.</p>
              </article>
              <article class="service">
                <span class="service-number">3</span>
                <h3>Control administrativo</h3>
                <p>Administra ventas, asistentes, reportes y validacion de boletas con una vista de trabajo directa.</p>
              </article>
            </div>
          </div>
        </section>

        <section id="nosotros" class="section soft">
          <div class="inner about">
            <div class="about-image" aria-hidden="true"></div>
            <div class="about-copy">
              <p class="eyeline">Quienes somos</p>
              <h2>Tecnologia simple para eventos que se sienten profesionales.</h2>
              <p>
                Eventix nace para reemplazar procesos manuales, listas confusas y accesos lentos.
                La plataforma conecta ventas, usuarios y check-in para que cada evento tenga una
                operacion mas ordenada desde el primer registro.
              </p>
              <p>
                Nuestro objetivo es que el organizador vea lo importante rapido y que el cliente
                compre sin friccion, con una experiencia sobria, confiable y facil de usar.
              </p>
              <div class="statement">
                <strong>Menos filas, menos errores y mas control sobre cada boleta vendida.</strong>
              </div>
            </div>
          </div>
        </section>

        <section class="cta-band">
          <div class="inner">
            <div>
              <h2>Encuentra tu proximo evento o gestiona el tuyo.</h2>
              <p>
                Compra entradas disponibles, revisa tus boletas o entra al panel administrativo
                para operar tus eventos.
              </p>
            </div>
            <div class="actions">
              <a class="button-primary" href="/user/eventos">Ver eventos</a>
              <a class="button-secondary" href="/login">Panel admin</a>
            </div>
          </div>
        </section>

        <footer class="footer">
          <div class="inner">
            <strong>Eventix</strong>
            <span>Gestion profesional de eventos, boletas y acceso.</span>
            <a href="/user/eventos">Explorar eventos</a>
          </div>
        </footer>
      </body>
    </html>
  `);
});

module.exports = router;
