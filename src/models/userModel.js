const { getDatabase } = require("../config/database");

async function listUsers(search) {
  const db = await getDatabase();
  const params = [];
  let where = "";

  if (search) {
    where = "WHERE nombre LIKE ? OR email LIKE ?";
    params.push(`%${search}%`, `%${search}%`);
  }

  // Consulta SQL con busqueda por nombre o correo electronico.
  return db.all(
    `SELECT id, nombre, email, telefono, creado_en
     FROM usuarios
     ${where}
     ORDER BY creado_en DESC, id DESC`,
    params
  );
}

async function findUserById(id) {
  const db = await getDatabase();

  return db.get(
    `SELECT id, nombre, email, telefono, creado_en
     FROM usuarios
     WHERE id = ?`,
    id
  );
}

async function deleteUser(id) {
  const db = await getDatabase();
  const result = await db.run("DELETE FROM usuarios WHERE id = ?", id);

  return result.changes > 0;
}

module.exports = {
  deleteUser,
  findUserById,
  listUsers,
};
