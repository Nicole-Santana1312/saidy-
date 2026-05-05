const app = require("./app");
const env = require("./config/env");
const { initializeAdmin } = require("./config/adminStore");
const { initializeDatabase } = require("./config/database");

async function startServer() {
  await initializeAdmin();
  await initializeDatabase();

  app.listen(env.port, () => {
    console.log(`Servidor iniciado en http://localhost:${env.port}`);
    console.log(`Admin inicial: ${env.adminEmail}`);
  });
}

startServer().catch((error) => {
  console.error("No se pudo iniciar el servidor.", error);
  process.exit(1);
});
