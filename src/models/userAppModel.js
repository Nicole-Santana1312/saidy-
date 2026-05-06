const { getSupabase } = require("../config/database");

async function findUserAppByEmail(email) {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("usuarios_app")
    .select(
      "id, nombre, email, password_hash, foto, telefono, creado_en, actualizado_en, is_verified, verification_code"
    )
    .eq("email", email.toLowerCase())
    .single();

  if (error && error.code !== "PGRST116") {
    throwSupabaseError("No se pudo consultar el usuario en Supabase", error);
  }

  return data || null;
}

async function findUserAppById(id) {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("usuarios_app")
    .select("id, nombre, email, foto, telefono, creado_en, actualizado_en, is_verified")
    .eq("id", id)
    .single();

  if (error && error.code !== "PGRST116") {
    throwSupabaseError("No se pudo consultar el usuario en Supabase", error);
  }

  return data || null;
}

async function createUserApp(userData) {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("usuarios_app")
    .insert([
      {
        nombre: userData.nombre,
        email: userData.email.toLowerCase(),
        password_hash: userData.password_hash,
        telefono: userData.telefono || null,
        is_verified: Boolean(userData.is_verified),
        verification_code: userData.verification_code || null,
        actualizado_en: new Date().toISOString(),
      },
    ])
    .select("id")
    .single();

  if (error) {
    throwSupabaseError("No se pudo crear el usuario en Supabase", error);
  }

  return findUserAppById(data.id);
}

async function updateUserApp(id, userData) {
  const supabase = getSupabase();

  const { error } = await supabase
    .from("usuarios_app")
    .update({
      nombre: userData.nombre,
      email: userData.email,
      foto: userData.foto || null,
      telefono: userData.telefono || null,
      actualizado_en: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    throwSupabaseError("No se pudo actualizar el usuario en Supabase", error);
  }

  return findUserAppById(id);
}

async function deleteUserApp(id) {
  const supabase = getSupabase();

  const { error } = await supabase.from("usuarios_app").delete().eq("id", id);

  if (error) {
    throwSupabaseError("No se pudo eliminar el usuario en Supabase", error);
  }

  return true;
}

async function findUserAppByVerificationCode(code) {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("usuarios_app")
    .select("id, nombre, email, is_verified")
    .eq("verification_code", code)
    .single();

  if (error && error.code !== "PGRST116") {
    throwSupabaseError("No se pudo consultar el codigo de verificacion en Supabase", error);
  }

  return data || null;
}

async function verifyUserApp(id) {
  const supabase = getSupabase();

  const { error } = await supabase
    .from("usuarios_app")
    .update({
      is_verified: true,
      verification_code: null,
      actualizado_en: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    throwSupabaseError("No se pudo verificar el usuario en Supabase", error);
  }

  return findUserAppById(id);
}

function throwSupabaseError(message, supabaseError) {
  const detail = supabaseError.message || "Error desconocido";
  const error = new Error(`${message}. Detalle: ${detail}`);

  if (detail.toLowerCase().includes("fetch failed")) {
    error.message =
      "No se pudo conectar con Supabase. Revisa tu internet, SUPABASE_URL y SUPABASE_ANON_KEY en el archivo .env.";
    error.status = 503;
  }

  if (detail.toLowerCase().includes("does not exist")) {
    error.message =
      "La tabla de Supabase no tiene todas las columnas necesarias. Ejecuta SUPABASE_FIX_EXISTING_DB.sql en Supabase > SQL Editor.";
    error.status = 503;
  }

  throw error;
}

module.exports = {
  findUserAppByEmail,
  findUserAppById,
  createUserApp,
  updateUserApp,
  deleteUserApp,
  findUserAppByVerificationCode,
  verifyUserApp,
};
