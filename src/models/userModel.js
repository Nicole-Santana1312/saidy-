const { getSupabase } = require("../config/database");

async function listUsers(search) {
  const supabase = getSupabase();

  let query = supabase
    .from("usuarios_app")
    .select("id, nombre, email, telefono, foto, is_verified, creado_en, actualizado_en");

  if (search) {
    query = query.or(`nombre.ilike.%${search}%,email.ilike.%${search}%`);
  }

  const { data, error } = await query
    .order("creado_en", { ascending: false })
    .order("id", { ascending: false });

  if (error) {
    throw new Error(`Error listing users: ${error.message}`);
  }

  return data || [];
}

async function findUserById(id) {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("usuarios_app")
    .select("id, nombre, email, telefono, foto, is_verified, creado_en, actualizado_en")
    .eq("id", id)
    .single();

  if (error && error.code !== "PGRST116") {
    throw new Error(`Error finding user: ${error.message}`);
  }

  return data || null;
}

async function deleteUser(id) {
  const supabase = getSupabase();

  const { error } = await supabase.from("usuarios_app").delete().eq("id", id);

  if (error) {
    throw new Error(`Error deleting user: ${error.message}`);
  }

  return true;
}

module.exports = {
  deleteUser,
  findUserById,
  listUsers,
};
