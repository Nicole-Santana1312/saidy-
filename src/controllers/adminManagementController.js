const {
  createAdmin,
  deleteAdmin,
  findAdminByEmail,
  findAdminById,
  listAdmins,
} = require("../config/adminStore");

function renderAdminsPage(req, res) {
  return res.send(`
    <!doctype html>
    <html lang="es">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Administradores - Eventix</title>
        <link rel="stylesheet" href="/styles.css" />
        <script src="/admins.js" defer></script>
      </head>
      <body>
        <main class="events-page">
          <header class="events-header">
            <div>
              <p class="eyebrow">Super admin</p>
              <h1>Administradores</h1>
            </div>
            <a class="link-button" href="/admin/dashboard">Volver al dashboard</a>
          </header>

          <section class="event-form-panel">
            <div class="section-heading">
              <div>
                <p class="eyebrow">Acceso interno</p>
                <h2>Crear administrador</h2>
              </div>
            </div>

            <p class="form-message" data-admin-message hidden></p>

            <form class="event-form" data-admin-form novalidate>
              <label for="email">Correo</label>
              <input id="email" name="email" type="email" autocomplete="email" required />

              <label for="password">Contrasena temporal</label>
              <input id="password" name="password" type="password" autocomplete="new-password" required />

              <label for="role">Rol</label>
              <select id="role" name="role" required>
                <option value="admin">Administrador</option>
                <option value="super_admin">Admin principal</option>
              </select>

              <button type="submit">Crear administrador</button>
            </form>
          </section>

          <section class="events-list-panel">
            <div class="section-heading">
              <div>
                <p class="eyebrow">Equipo</p>
                <h2>Admins registrados</h2>
              </div>
            </div>
            <div class="responsive-table">
              <table class="sales-table">
                <thead>
                  <tr>
                    <th>Correo</th>
                    <th>Rol</th>
                    <th>Creado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody data-admins-table-body></tbody>
              </table>
            </div>
          </section>
        </main>
      </body>
    </html>
  `);
}

async function getAdmins(req, res, next) {
  try {
    const admins = await listAdmins();
    return res.json({ admins });
  } catch (error) {
    return next(error);
  }
}

async function storeAdmin(req, res, next) {
  try {
    const existingAdmin = await findAdminByEmail(req.body.email);

    if (existingAdmin) {
      return res.status(400).json({ message: "Ese correo ya pertenece a un administrador." });
    }

    const admin = await createAdmin(req.body);
    return res.status(201).json({
      message: "Administrador creado correctamente.",
      admin,
    });
  } catch (error) {
    return next(error);
  }
}

async function removeAdmin(req, res, next) {
  try {
    if (req.admin.sub === req.params.id) {
      return res.status(400).json({ message: "No puedes eliminar tu propio usuario admin." });
    }

    const admin = await findAdminById(req.params.id);

    if (!admin) {
      return res.status(404).json({ message: "Administrador no encontrado." });
    }

    await deleteAdmin(req.params.id);
    return res.json({ message: "Administrador eliminado correctamente." });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getAdmins,
  removeAdmin,
  renderAdminsPage,
  storeAdmin,
};
