const { getSupabase } = require("../config/database");

async function listPurchasesByUser(usuarioAppId) {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("compras")
    .select(
      `id,
       usuario_app_id,
       tipo_boleta_id,
       cantidad,
       total,
       fecha_compra,
       estado,
       tipos_boletas(tipo, precio),
       eventos:tipos_boletas(evento_id, eventos(id, nombre, fecha, lugar))`
    )
    .eq("usuario_app_id", usuarioAppId)
    .order("fecha_compra", { ascending: false })
    .order("id", { ascending: false });

  if (error) {
    throw new Error(`Error listing purchases: ${error.message}`);
  }

  return (data || []).map((purchase) => ({
    id: purchase.id,
    usuario_app_id: purchase.usuario_app_id,
    tipo_boleta_id: purchase.tipo_boleta_id,
    cantidad: purchase.cantidad,
    total: purchase.total,
    fecha_compra: purchase.fecha_compra,
    estado: purchase.estado,
    tipo_boleta: purchase.tipos_boletas?.tipo,
    precio: purchase.tipos_boletas?.precio,
    evento_id: purchase.eventos?.[0]?.evento_id,
    evento_nombre: purchase.eventos?.[0]?.eventos?.nombre,
    evento_fecha: purchase.eventos?.[0]?.eventos?.fecha,
    evento_lugar: purchase.eventos?.[0]?.eventos?.lugar,
  }));
}

async function getPurchaseById(id, usuarioAppId) {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("compras")
    .select(
      `id,
       usuario_app_id,
       tipo_boleta_id,
       cantidad,
       total,
       fecha_compra,
       estado,
       tipos_boletas(tipo, precio),
       eventos:tipos_boletas(evento_id, eventos(id, nombre, fecha, lugar))`
    )
    .eq("id", id)
    .eq("usuario_app_id", usuarioAppId)
    .single();

  if (error && error.code !== "PGRST116") {
    throw new Error(`Error getting purchase: ${error.message}`);
  }

  if (!data) return null;

  return {
    id: data.id,
    usuario_app_id: data.usuario_app_id,
    tipo_boleta_id: data.tipo_boleta_id,
    cantidad: data.cantidad,
    total: data.total,
    fecha_compra: data.fecha_compra,
    estado: data.estado,
    tipo_boleta: data.tipos_boletas?.tipo,
    precio: data.tipos_boletas?.precio,
    evento_id: data.eventos?.[0]?.evento_id,
    evento_nombre: data.eventos?.[0]?.eventos?.nombre,
    evento_fecha: data.eventos?.[0]?.eventos?.fecha,
    evento_lugar: data.eventos?.[0]?.eventos?.lugar,
  };
}

async function createPurchase(usuarioAppId, compraData) {
  const supabase = getSupabase();

  // Get ticket type to verify it exists and get the price
  const { data: ticketType, error: ticketError } = await supabase
    .from("tipos_boletas")
    .select("id, evento_id, precio, cantidad_disponible")
    .eq("id", compraData.tipo_boleta_id)
    .single();

  if (ticketError || !ticketType) {
    throw new Error("Ticket type not found");
  }

  if (Number(ticketType.cantidad_disponible) < Number(compraData.cantidad)) {
    const error = new Error("No hay suficientes boletas disponibles para completar la compra.");
    error.status = 400;
    throw error;
  }

  const total = Number(ticketType.precio) * Number(compraData.cantidad);

  // Create purchase
  const { data: purchaseResult, error: purchaseError } = await supabase
    .from("compras")
    .insert([
      {
        usuario_app_id: usuarioAppId,
        tipo_boleta_id: compraData.tipo_boleta_id,
        cantidad: compraData.cantidad,
        total: total,
      },
    ])
    .select("id")
    .single();

  if (purchaseError) {
    throw new Error(`Error creating purchase: ${purchaseError.message}`);
  }

  const nuevaCantidadDisponible =
    Number(ticketType.cantidad_disponible) - Number(compraData.cantidad);

  const { error: stockError } = await supabase
    .from("tipos_boletas")
    .update({
      cantidad_disponible: nuevaCantidadDisponible,
      actualizado_en: new Date().toISOString(),
    })
    .eq("id", compraData.tipo_boleta_id);

  if (stockError) {
    throw new Error(`Error updating ticket stock: ${stockError.message}`);
  }

  // Create individual tickets
  const ticketsToInsert = [];
  const seats = await getNextSeats(ticketType.evento_id, Number(compraData.cantidad));

  for (let i = 0; i < compraData.cantidad; i++) {
    const codigoUnico = generateTicketCode();
    ticketsToInsert.push({
      compra_id: purchaseResult.id,
      codigo_unico: codigoUnico,
      tipo_boleta_id: compraData.tipo_boleta_id,
      evento_id: ticketType.evento_id,
      usuario_app_id: usuarioAppId,
      fila: seats[i].fila,
      asiento: seats[i].asiento,
    });
  }

  const { data: insertedTickets, error: ticketInsertError } = await supabase
    .from("boletos")
    .insert(ticketsToInsert)
    .select(
      `id,
       codigo_unico,
       fila,
       asiento,
       estado,
       tipos_boletas(tipo, precio),
       eventos(nombre, fecha, lugar)`
    );

  if (ticketInsertError) {
    await supabase.from("compras").delete().eq("id", purchaseResult.id);
    await supabase
      .from("tipos_boletas")
      .update({
        cantidad_disponible: ticketType.cantidad_disponible,
        actualizado_en: new Date().toISOString(),
      })
      .eq("id", compraData.tipo_boleta_id);

    if ((ticketInsertError.message || "").toLowerCase().includes("duplicate")) {
      const error = new Error("No se pudo asignar asiento porque otro usuario compro al mismo tiempo. Intenta nuevamente.");
      error.status = 409;
      throw error;
    }

    throw new Error(`Error creating tickets: ${ticketInsertError.message}`);
  }

  const purchase = await getPurchaseById(purchaseResult.id, usuarioAppId);
  return {
    ...purchase,
    tickets: (insertedTickets || []).map((ticket) => ({
      ...ticket,
      tipo: ticket.tipos_boletas?.tipo,
      precio: ticket.tipos_boletas?.precio,
      evento_nombre: ticket.eventos?.nombre,
      evento_fecha: ticket.eventos?.fecha,
      evento_lugar: ticket.eventos?.lugar,
    })),
  };
}

async function getNextSeats(eventId, quantity) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("boletos")
    .select("asiento")
    .eq("evento_id", eventId)
    .eq("fila", "A")
    .order("asiento", { ascending: false })
    .limit(1);

  if (error) {
    throw new Error(`Error assigning seats: ${error.message}`);
  }

  const lastSeat = Number(data?.[0]?.asiento || 0);

  return Array.from({ length: quantity }, (_, index) => ({
    fila: "A",
    asiento: lastSeat + index + 1,
  }));
}

function generateTicketCode() {
  // Generate 12-character unique code
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 12; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

module.exports = {
  listPurchasesByUser,
  getPurchaseById,
  createPurchase,
};
