const { createClient } = require("@supabase/supabase-js");
const env = require("./env");

let supabase = null;

function getSupabase() {
  if (!supabase) {
    if (!env.supabaseUrl || (!env.supabaseServiceKey && !env.supabaseKey)) {
      const error = new Error(
        "Supabase credentials not configured. Please add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to .env"
      );
      error.status = 503;
      throw error;
    }

    if (env.supabaseUrl.includes("/rest/v1")) {
      const error = new Error(
        "SUPABASE_URL debe ser la URL base del proyecto, sin /rest/v1/. Ejemplo: https://tu-proyecto.supabase.co"
      );
      error.status = 503;
      throw error;
    }

    supabase = createClient(env.supabaseUrl, env.supabaseServiceKey || env.supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }

  return supabase;
}

// Alias for backward compatibility
function getDatabase() {
  return getSupabase();
}

async function initializeDatabase() {
  // With Supabase, database initialization is handled through the Supabase dashboard
  // This function is kept for backward compatibility
  console.log("Database is ready with Supabase.");
}

module.exports = {
  getSupabase,
  getDatabase,
  initializeDatabase,
};
