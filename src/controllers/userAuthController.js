const bcrypt = require("bcrypt");
const { randomInt } = require("crypto");
const {
  findUserAppByEmail,
  createUserApp,
  findUserAppByVerificationCode,
  verifyUserApp,
} = require("../models/userAppModel");
const { signUserToken, verifyToken } = require("../utils/jwt");
const { wantsHtml } = require("../utils/requestFormat");
const { sendVerificationEmail, sendLoginNotification } = require("../utils/email");
const env = require("../config/env");

const cookieOptions = {
  httpOnly: true,
  sameSite: "strict",
  secure: env.nodeEnv === "production",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
};

function renderLoginPage(req, res) {
  if (req.cookies.user_token) {
    try {
      verifyToken(req.cookies.user_token);
      return res.redirect(303, "/user/dashboard");
    } catch (error) {
      res.clearCookie("user_token");
    }
  }

  const error = req.query.error
    ? `<p class="alert">${escapeHtml(req.query.error)}</p>`
    : "";
  const success = req.query.success
    ? `<p class="success-message">${escapeHtml(req.query.success)}</p>`
    : "";

  return res.send(`
    <!doctype html>
    <html lang="es">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Iniciar Sesión - Eventix</title>
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body>
        <main class="auth-shell">
          <section class="auth-panel">
            <img class="auth-logo" src="/eventix-logo.svg" alt="Eventix" />
            <h1>Eventix</h1>
            <p class="eyebrow">Usuario</p>
            ${error}
            ${success}
            <form action="/user/login" method="post" novalidate>
              <label for="email">Email</label>
              <input id="email" name="email" type="email" autocomplete="email" required />

              <label for="password">Contraseña</label>
              <input id="password" name="password" type="password" autocomplete="current-password" required />

              <button type="submit">Iniciar sesión</button>
            </form>
            <p class="auth-link">
              ¿No tienes cuenta? <a href="/user/register">Regístrate aquí</a>
            </p>
            <p class="auth-link">
              Eres administrador? <a href="/login">Entrar al panel administrativo</a>
            </p>
          </section>
        </main>
      </body>
    </html>
  `);
}

function renderRegisterPage(req, res) {
  if (req.cookies.user_token) {
    try {
      verifyToken(req.cookies.user_token);
      return res.redirect(303, "/user/dashboard");
    } catch (error) {
      res.clearCookie("user_token");
    }
  }

  const error = req.query.error
    ? `<p class="alert">${escapeHtml(req.query.error)}</p>`
    : "";

  return res.send(`
    <!doctype html>
    <html lang="es">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Registrarse - Eventix</title>
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body>
        <main class="auth-shell">
          <section class="auth-panel">
            <img class="auth-logo" src="/eventix-logo.svg" alt="Eventix" />
            <h1>Eventix</h1>
            <p class="eyebrow">Crear Cuenta</p>
            ${error}
            <form action="/user/register" method="post" novalidate>
              <label for="nombre">Nombre Completo</label>
              <input id="nombre" name="nombre" type="text" autocomplete="name" required />

              <label for="email">Email</label>
              <input id="email" name="email" type="email" autocomplete="email" required />

              <label for="password">Contraseña</label>
              <input id="password" name="password" type="password" autocomplete="new-password" required />

              <label for="telefono">Teléfono (Opcional)</label>
              <input id="telefono" name="telefono" type="tel" autocomplete="tel" />

              <button type="submit">Crear Cuenta</button>
            </form>
            <p class="auth-note">Te enviaremos un código de verificación a tu correo.</p>
            <p class="auth-link">
              ¿Ya tienes cuenta? <a href="/user/login">Inicia sesión</a>
            </p>
          </section>
        </main>
      </body>
    </html>
  `);
}

async function register(req, res, next) {
  try {
    const { nombre, email, password, telefono } = req.body;

    const existingUser = await findUserAppByEmail(email);
    if (existingUser) {
      const message = "Este email ya está registrado.";
      if (wantsHtml(req)) {
        return res.redirect(303, `/user/register?error=${encodeURIComponent(message)}`);
      }
      return res.status(400).json({ message });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    let userData = {
      nombre,
      email,
      password_hash: passwordHash,
      telefono,
    };

    let emailWasSent = false;
    let verificationCode = null;

    if (env.emailUser && env.emailPassword) {
      verificationCode = String(randomInt(100000, 1000000)).padStart(6, "0");
      userData.verification_code = verificationCode;
      userData.is_verified = false;

      try {
        await sendVerificationEmail(email, nombre, verificationCode);
        emailWasSent = true;
      } catch (emailError) {
        console.error("Verification email failed:", emailError.message);
        // Si el correo falla, igual creamos el usuario pero lo marcamos como verificado
        userData.is_verified = true;
        userData.verification_code = null;
      }
    } else {
      // Sin configuración de email, el usuario queda verificado directamente
      userData.is_verified = true;
      userData.verification_code = null;
    }

    await createUserApp(userData);

    if (wantsHtml(req)) {
      if (emailWasSent) {
        // Redirigir a la página de verificación para que ingrese el código
        return res.redirect(303, `/user/verify`);
      }
      return res.redirect(
        303,
        `/user/login?success=${encodeURIComponent("Cuenta creada correctamente. Ya puedes iniciar sesión.")}`
      );
    }

    return res.status(201).json({
      message: emailWasSent
        ? "Usuario registrado correctamente. Revisa tu correo para verificar tu cuenta."
        : "Usuario registrado correctamente.",
    });
  } catch (error) {
    return next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await findUserAppByEmail(email);

    if (!user) {
      return invalidCredentials(req, res);
    }

    if (!user.is_verified) {
      const message = "Tu cuenta no está verificada. Revisa el correo que te enviamos.";
      if (wantsHtml(req)) {
        return res.redirect(303, `/user/login?error=${encodeURIComponent(message)}`);
      }
      return res.status(403).json({ message });
    }

    const passwordIsValid = await bcrypt.compare(password, user.password_hash);

    if (!passwordIsValid) {
      return invalidCredentials(req, res);
    }

    const token = signUserToken(user);
    res.cookie("user_token", token, cookieOptions);

    try {
      await sendLoginNotification(email, user.nombre);
    } catch (notifyError) {
      console.error("Login notification failed:", notifyError.message);
    }

    return res.redirect(303, "/user/dashboard");
  } catch (error) {
    return next(error);
  }
}

function logout(req, res) {
  res.clearCookie("user_token", {
    httpOnly: true,
    sameSite: "strict",
    secure: env.nodeEnv === "production",
  });

  return res.redirect(303, "/");
}

async function renderVerificationPage(req, res) {
  if (req.cookies.user_token) {
    try {
      verifyToken(req.cookies.user_token);
      return res.redirect(303, "/user/dashboard");
    } catch (error) {
      res.clearCookie("user_token");
    }
  }

  const error = req.query.error
    ? `<p class="alert">${escapeHtml(req.query.error)}</p>`
    : "";
  const success = req.query.success
    ? `<p class="success-message">${escapeHtml(req.query.success)}</p>`
    : "";

  return res.send(`
    <!doctype html>
    <html lang="es">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Verificar Cuenta - Eventix</title>
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body>
        <main class="auth-shell">
          <section class="auth-panel">
            <img class="auth-logo" src="/eventix-logo.svg" alt="Eventix" />
            <h1>Verificar Cuenta</h1>
            <p class="eyebrow">Código de verificación</p>
            ${error}
            ${success}
            <p class="auth-note">Ingresa el código de 6 dígitos que enviamos a tu correo.</p>
            <form action="/user/verify" method="post" novalidate>
              <label for="verification_code">Código</label>
              <input id="verification_code" name="verification_code" type="text" inputmode="numeric" maxlength="6" required placeholder="123456" />
              <button type="submit">Verificar</button>
            </form>
            <p class="auth-link">
              ¿Ya verificaste tu cuenta? <a href="/user/login">Inicia sesión</a>
            </p>
          </section>
        </main>
      </body>
    </html>
  `);
}

async function verifyAccount(req, res, next) {
  try {
    const { verification_code } = req.body;

    const user = await findUserAppByVerificationCode(verification_code);
    if (!user) {
      const message = "Código de verificación inválido o expirado.";
      if (wantsHtml(req)) {
        return res.redirect(303, `/user/verify?error=${encodeURIComponent(message)}`);
      }
      return res.status(404).json({ message });
    }

    if (user.is_verified) {
      if (wantsHtml(req)) {
        return res.redirect(303, `/user/login?success=${encodeURIComponent("Tu cuenta ya está verificada.")}`);
      }
      return res.status(200).json({ message: "Cuenta ya verificada." });
    }

    await verifyUserApp(user.id);

    if (wantsHtml(req)) {
      return res.redirect(303, `/user/login?success=${encodeURIComponent("Cuenta verificada correctamente. Ya puedes iniciar sesión.")}`);
    }

    return res.status(200).json({ message: "Cuenta verificada correctamente." });
  } catch (error) {
    return next(error);
  }
}

function invalidCredentials(req, res) {
  const message = "Email o contraseña incorrectos.";

  if (wantsHtml(req)) {
    return res.redirect(303, `/user/login?error=${encodeURIComponent(message)}`);
  }

  return res.status(401).json({ message });
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
  renderLoginPage,
  renderRegisterPage,
  renderVerificationPage,
  register,
  verifyAccount,
  login,
  logout,
};

