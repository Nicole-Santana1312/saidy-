const bcrypt = require("bcrypt");
const env = require("./env");

const SALT_ROUNDS = 12;

// En un proyecto real este administrador debe vivir en una base de datos.
// Para este ejemplo lo dejamos en memoria y guardamos solamente el hash.
const adminUser = {
  id: "admin-1",
  email: env.adminEmail,
  role: "admin",
  passwordHash: null,
};

async function initializeAdmin() {
  adminUser.passwordHash = await bcrypt.hash(env.adminPassword, SALT_ROUNDS);
}

function findAdminByEmail(email) {
  if (adminUser.email.toLowerCase() !== email.toLowerCase()) {
    return null;
  }

  return adminUser;
}

module.exports = {
  initializeAdmin,
  findAdminByEmail,
};
