const { getSupabase } = require("../config/database");

async function listEvents() {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("eventos")
    .select("id, nombre, fecha, hora, lugar, descripcion, imagen, categoria, estado, creado_en, actualizado_en")
    .order("fecha", { ascending: true })
    .order("id", { ascending: false });

  if (error) {
    throw new Error(`Error listing events: ${error.message}`);
  }

  return data || [];
}

async function findEventById(id) {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("eventos")
    .select("id, nombre, fecha, hora, lugar, descripcion, imagen, categoria, estado, creado_en, actualizado_en")
    .eq("id", id)
    .single();

  if (error && error.code !== "PGRST116") {
    throw new Error(`Error finding event: ${error.message}`);
  }

  return data || null;
}

async function createEvent(eventData) {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("eventos")
    .insert([
      {
        nombre: eventData.nombre,
        fecha: eventData.fecha,
        hora: eventData.hora,
        lugar: eventData.lugar,
        descripcion: eventData.descripcion,
        imagen: eventData.imagen,
        categoria: eventData.categoria,
        estado: eventData.estado || "activo",
      },
    ])
    .select("id, nombre, fecha, hora, lugar, descripcion, imagen, categoria, estado, creado_en, actualizado_en")
    .single();

  if (error) {
    throwSupabaseError("Error creating event", error);
  }

  return data;
}

async function updateEvent(id, eventData) {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("eventos")
    .update({
      nombre: eventData.nombre,
      fecha: eventData.fecha,
      hora: eventData.hora,
      lugar: eventData.lugar,
      descripcion: eventData.descripcion,
      imagen: eventData.imagen,
      categoria: eventData.categoria,
      estado: eventData.estado,
      actualizado_en: new Date().toISOString(),
    })
    .eq("id", id)
    .select("id, nombre, fecha, hora, lugar, descripcion, imagen, categoria, estado, creado_en, actualizado_en")
    .single();

  if (error) {
    throwSupabaseError("Error updating event", error);
  }

  return data || null;
}

async function deleteEvent(id) {
  const supabase = getSupabase();

  const { error } = await supabase.from("eventos").delete().eq("id", id);

  if (error) {
    throwSupabaseError("Error deleting event", error);
  }

  return true;
}

module.exports = {
  listEvents,
  findEventById,
  createEvent,
  updateEvent,
  deleteEvent,
};

function throwSupabaseError(message, supabaseError) {
  const detail = supabaseError.message || "Error desconocido";
  const error = new Error(`${message}: ${detail}`);

  if (detail.toLowerCase().includes("row-level security")) {
    error.message =
      "Supabase bloqueo la operacion por RLS. Revisa que SUPABASE_SERVICE_ROLE_KEY este configurada en .env y reinicia el servidor.";
    error.status = 403;
  }

  throw error;
}
