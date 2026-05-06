const { getSupabase } = require("../config/database");

async function listTicketTypesByEvent(eventId) {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("tipos_boletas")
    .select(
      `id,
       evento_id,
       tipo,
       precio,
       cantidad_disponible,
       creado_en,
       actualizado_en,
       eventos(nombre)`
    )
    .eq("evento_id", eventId)
    .order("tipo", { ascending: true });

  if (error) {
    throw new Error(`Error listing ticket types: ${error.message}`);
  }

  return addSoldCounts((data || []).map((item) => ({
    ...item,
    evento_nombre: item.eventos?.nombre,
  })));
}

async function findTicketTypeById(id) {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("tipos_boletas")
    .select(
      `id,
       evento_id,
       tipo,
       precio,
       cantidad_disponible,
       creado_en,
       actualizado_en,
       eventos(nombre)`
    )
    .eq("id", id)
    .single();

  if (error && error.code !== "PGRST116") {
    throw new Error(`Error finding ticket type: ${error.message}`);
  }

  if (!data) return null;

  return {
    ...data,
    evento_nombre: data.eventos?.nombre,
    cantidad_vendida: await countSoldTicketsByType(id),
  };
}

async function createTicketType(ticketData) {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("tipos_boletas")
    .insert([
      {
        evento_id: ticketData.evento_id,
        tipo: ticketData.tipo,
        precio: ticketData.precio,
        cantidad_disponible: ticketData.cantidad_disponible,
      },
    ])
    .select("id")
    .single();

  if (error) {
    throw new Error(`Error creating ticket type: ${error.message}`);
  }

  return findTicketTypeById(data.id);
}

async function updateTicketType(id, ticketData) {
  const supabase = getSupabase();

  const { error } = await supabase
    .from("tipos_boletas")
    .update({
      evento_id: ticketData.evento_id,
      tipo: ticketData.tipo,
      precio: ticketData.precio,
      cantidad_disponible: ticketData.cantidad_disponible,
      actualizado_en: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    throw new Error(`Error updating ticket type: ${error.message}`);
  }

  return findTicketTypeById(id);
}

async function deleteTicketType(id) {
  const supabase = getSupabase();

  const { error } = await supabase.from("tipos_boletas").delete().eq("id", id);

  if (error) {
    throw new Error(`Error deleting ticket type: ${error.message}`);
  }

  return true;
}

async function addSoldCounts(ticketTypes) {
  return Promise.all(
    ticketTypes.map(async (ticketType) => ({
      ...ticketType,
      cantidad_vendida: await countSoldTicketsByType(ticketType.id),
    }))
  );
}

async function countSoldTicketsByType(ticketTypeId) {
  const supabase = getSupabase();

  const { count, error } = await supabase
    .from("boletos")
    .select("id", { count: "exact", head: true })
    .eq("tipo_boleta_id", ticketTypeId)
    .neq("estado", "cancelado");

  if (error && /does not exist|schema cache/i.test(error.message || "")) {
    return 0;
  }

  if (error) {
    throw new Error(`Error counting sold tickets: ${error.message}`);
  }

  return count || 0;
}

module.exports = {
  listTicketTypesByEvent,
  findTicketTypeById,
  createTicketType,
  updateTicketType,
  deleteTicketType,
};
