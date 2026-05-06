const { getSupabase } = require("../config/database");

async function getTicketByCode(codigo_unico) {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("boletos")
    .select(
      `id,
       compra_id,
       codigo_unico,
       tipo_boleta_id,
       evento_id,
       usuario_app_id,
       fila,
       asiento,
       estado,
       fecha_validacion,
       creado_en,
       tipos_boletas(tipo, precio),
       eventos(nombre, fecha, lugar),
       usuarios_app(nombre, email)`
    )
    .eq("codigo_unico", codigo_unico)
    .single();

  if (error && error.code !== "PGRST116") {
    throw new Error(`Error getting ticket: ${error.message}`);
  }

  if (!data) return null;

  return {
    ...data,
    tipo_boleta: data.tipos_boletas?.tipo,
    precio: data.tipos_boletas?.precio,
    evento_nombre: data.eventos?.nombre,
    evento_fecha: data.eventos?.fecha,
    evento_lugar: data.eventos?.lugar,
    usuario_nombre: data.usuarios_app?.nombre,
    usuario_email: data.usuarios_app?.email,
  };
}

async function getTicketById(id) {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("boletos")
    .select(
      `id,
       compra_id,
       codigo_unico,
       tipo_boleta_id,
       evento_id,
       usuario_app_id,
       fila,
       asiento,
       estado,
       fecha_validacion,
       creado_en,
       tipos_boletas(tipo, precio),
       eventos(nombre, fecha, lugar),
       usuarios_app(nombre, email)`
    )
    .eq("id", id)
    .single();

  if (error && error.code !== "PGRST116") {
    throw new Error(`Error getting ticket: ${error.message}`);
  }

  if (!data) return null;

  return {
    ...data,
    tipo_boleta: data.tipos_boletas?.tipo,
    precio: data.tipos_boletas?.precio,
    evento_nombre: data.eventos?.nombre,
    evento_fecha: data.eventos?.fecha,
    evento_lugar: data.eventos?.lugar,
    usuario_nombre: data.usuarios_app?.nombre,
    usuario_email: data.usuarios_app?.email,
  };
}

async function getTicketsByPurchase(compraId) {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("boletos")
    .select(
      `id,
       codigo_unico,
       evento_id,
       fila,
       asiento,
       estado,
       fecha_validacion,
       tipos_boletas(tipo),
       eventos(nombre)`
    )
    .eq("compra_id", compraId)
    .order("creado_en", { ascending: true });

  if (error) {
    throw new Error(`Error getting tickets: ${error.message}`);
  }

  return (data || []).map((ticket) => ({
    ...ticket,
    tipo: ticket.tipos_boletas?.tipo,
    evento_nombre: ticket.eventos?.nombre,
  }));
}

async function validateTicket(codigo_unico) {
  const ticket = await getTicketByCode(codigo_unico);

  if (!ticket) {
    return {
      success: false,
      message: "Boleto no encontrado.",
    };
  }

  if (ticket.estado === "usado") {
    return {
      success: false,
      message: "Este boleto ya ha sido utilizado.",
    };
  }

  if (ticket.estado === "cancelado") {
    return {
      success: false,
      message: "Este boleto ha sido cancelado.",
    };
  }

  // Mark as used
  const supabase = getSupabase();
  const { error } = await supabase
    .from("boletos")
    .update({
      estado: "usado",
      fecha_validacion: new Date().toISOString(),
    })
    .eq("id", ticket.id);

  if (error) {
    return {
      success: false,
      message: "Error al validar el boleto.",
    };
  }

  const updatedTicket = await getTicketById(ticket.id);

  return {
    success: true,
    message: "Boleto validado correctamente.",
    ticket: updatedTicket,
  };
}

async function getTicketsByUser(usuarioAppId) {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("boletos")
    .select(
      `id,
       codigo_unico,
       evento_id,
       fila,
       asiento,
       estado,
       fecha_validacion,
       creado_en,
       tipos_boletas(tipo, precio),
       eventos(nombre, fecha, lugar),
       compras(fecha_compra)`
    )
    .eq("usuario_app_id", usuarioAppId)
    .order("eventos(fecha)", { ascending: false })
    .order("creado_en", { ascending: false });

  if (error) {
    throw new Error(`Error getting user tickets: ${error.message}`);
  }

  return (data || []).map((ticket) => ({
    ...ticket,
    tipo: ticket.tipos_boletas?.tipo,
    precio: ticket.tipos_boletas?.precio,
    evento_nombre: ticket.eventos?.nombre,
    evento_fecha: ticket.eventos?.fecha,
    evento_lugar: ticket.eventos?.lugar,
    fecha_compra: ticket.compras?.[0]?.fecha_compra,
  }));
}

module.exports = {
  getTicketByCode,
  getTicketById,
  getTicketsByPurchase,
  getTicketsByUser,
  validateTicket,
};
