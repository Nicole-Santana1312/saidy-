const userModel = require("../models/userModel");

async function renderUsersPage(req, res) {
  return res.send(`
    <!doctype html>
    <html lang="es">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Usuarios - Eventix</title>
        <link rel="stylesheet" href="/styles.css" />
        <script src="/users.js" defer></script>
      </head>
      <body>
        <main class="events-page">
          <header class="events-header">
            <div>
              <p class="eyebrow">Administracion</p>
              <h1>Usuarios registrados</h1>
            </div>
            <a class="link-button" href="/admin/dashboard">Volver al dashboard</a>
          </header>

          <section class="events-list-panel">
            <div class="section-heading">
              <div>
                <p class="eyebrow">Consulta SQL</p>
                <h2>Listado de usuarios</h2>
              </div>
              <form class="search-form" data-user-search-form>
                <input name="q" type="search" placeholder="Buscar por nombre o email" />
                <button class="compact-button" type="submit">Buscar</button>
              </form>
            </div>

            <p class="form-message" data-user-message hidden></p>

            <div class="users-layout">
              <div class="responsive-table">
                <table class="sales-table">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Email</th>
                      <th>Telefono</th>
                      <th>Registro</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody data-users-table-body></tbody>
                </table>
              </div>

              <aside class="user-detail-panel" data-user-detail>
                <p class="eyebrow">Detalle</p>
                <h2>Selecciona un usuario</h2>
                <p>Haz clic en Ver detalle para consultar la informacion registrada.</p>
              </aside>
            </div>
          </section>
        </main>
      </body>
    </html>
  `);
}

async function listUsers(req, res, next) {
  try {
    const users = await userModel.listUsers(req.query.q);
    return res.json({ users });
  } catch (error) {
    return next(error);
  }
}

async function getUser(req, res, next) {
  try {
    const user = await userModel.findUserById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    return res.json({ user });
  } catch (error) {
    return next(error);
  }
}

async function deleteUser(req, res, next) {
  try {
    const wasDeleted = await userModel.deleteUser(req.params.id);

    if (!wasDeleted) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    return res.json({ message: "Usuario eliminado correctamente." });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  deleteUser,
  getUser,
  listUsers,
  renderUsersPage,
};
