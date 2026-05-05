const bcrypt = require("bcrypt");
const { findAdminByEmail } = require("../config/adminStore");
const { signAdminToken, verifyToken } = require("../utils/jwt");
const { wantsHtml } = require("../utils/requestFormat");
const { clearLoginAttempts } = require("../middlewares/securityMiddleware");
const env = require("../config/env");

const cookieOptions = {
  httpOnly: true,
  sameSite: "strict",
  secure: env.nodeEnv === "production",
  maxAge: 60 * 60 * 1000,
};

function renderLogin(req, res) {
  if (req.cookies.admin_token) {
    try {
      verifyToken(req.cookies.admin_token);
      return res.redirect(303, "/admin/dashboard");
    } catch (error) {
      res.clearCookie("admin_token");
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
        <title>Login - Eventix</title>
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body>
        <main class="auth-shell">
          <section class="auth-panel">
            <img class="auth-logo" src="/eventix-logo.svg" alt="Eventix" />
            <h1>Eventix</h1>
            ${error}
            <form action="/login" method="post" novalidate>
              <label for="email">Email</label>
              <input id="email" name="email" type="email" autocomplete="email" required />

              <label for="password">Contrasena</label>
              <input id="password" name="password" type="password" autocomplete="current-password" required />

              <button type="submit">Iniciar sesion</button>
            </form>
          </section>
        </main>
      </body>
    </html>
  `);
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const admin = findAdminByEmail(email);

    if (!admin) {
      return invalidCredentials(req, res);
    }

    const passwordIsValid = await bcrypt.compare(password, admin.passwordHash);

    if (!passwordIsValid) {
      return invalidCredentials(req, res);
    }

    const token = signAdminToken(admin);

    clearLoginAttempts(req);
    res.cookie("admin_token", token, cookieOptions);

    return res.redirect(303, "/admin/dashboard");
  } catch (error) {
    return next(error);
  }
}

function logout(req, res) {
  res.clearCookie("admin_token", {
    httpOnly: true,
    sameSite: "strict",
    secure: env.nodeEnv === "production",
  });

  return res.redirect(303, "/login");
}

function invalidCredentials(req, res) {
  const message = "Email o contrasena incorrectos.";

  if (wantsHtml(req)) {
    return res.redirect(303, `/login?error=${encodeURIComponent(message)}`);
  }

  return res.status(401).json({ message });
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
  renderLogin,
  login,
  logout,
};
