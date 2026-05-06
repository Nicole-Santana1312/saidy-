const { getSupabase } = require("../config/database");

async function listSales(eventId) {
  const supabase = getSupabase();
  const ticketIds = await getTicketTypeIdsForEvent(supabase, eventId);

  if (eventId && ticketIds.length === 0) {
    return [];
  }

  const [manualSales, userPurchases] = await Promise.all([
    listManualSales(supabase, ticketIds),
    listCompletedPurchases(supabase, ticketIds),
  ]);

  return [...manualSales, ...userPurchases].sort((a, b) => {
    const dateA = new Date(a.fecha_compra).getTime();
    const dateB = new Date(b.fecha_compra).getTime();

    if (dateA !== dateB) {
      return dateB - dateA;
    }

    return String(b.id).localeCompare(String(a.id));
  });
}

async function listManualSales(supabase, ticketIds) {
  let query = supabase.from("ventas").select(
    `id,
     usuario,
     cantidad,
     total,
     fecha_compra,
     tipos_boletas(id, tipo, precio, evento_id, eventos(id, nombre, fecha, lugar))`
  );

  if (ticketIds) {
    query = query.in("tipo_boleta_id", ticketIds);
  }

  const { data, error } = await query
    .order("fecha_compra", { ascending: false })
    .order("id", { ascending: false });

  if (error) {
    throw new Error(`Error listing sales: ${error.message}`);
  }

  return (data || []).map((sale) => ({
    id: sale.id,
    usuario: sale.usuario,
    cantidad: sale.cantidad,
    total: sale.total,
    fecha_compra: sale.fecha_compra,
    tipo_boleta_id: sale.tipos_boletas?.id,
    tipo_boleta: sale.tipos_boletas?.tipo,
    precio: sale.tipos_boletas?.precio,
    evento_id: sale.tipos_boletas?.evento_id,
    evento_nombre: sale.tipos_boletas?.eventos?.nombre,
    evento_fecha: sale.tipos_boletas?.eventos?.fecha,
    evento_lugar: sale.tipos_boletas?.eventos?.lugar,
    estado: "completada",
    source: "venta_manual",
  }));
}

async function listCompletedPurchases(supabase, ticketIds) {
  let query = supabase
    .from("compras")
    .select(
      `id,
       usuario_app_id,
       tipo_boleta_id,
       cantidad,
       total,
       fecha_compra,
       estado,
       metodo_pago,
       estado_pago,
       referencia_pago,
       pago_ultimos4,
       usuarios_app(nombre, email),
       tipos_boletas(id, tipo, precio, evento_id, eventos(id, nombre, fecha, lugar))`
    )
    .eq("estado", "completada")
    .eq("estado_pago", "pagado");

  if (ticketIds) {
    query = query.in("tipo_boleta_id", ticketIds);
  }

  const { data, error } = await query
    .order("fecha_compra", { ascending: false })
    .order("id", { ascending: false });

  if (error) {
    throw new Error(`Error listing purchases as sales: ${error.message}`);
  }

  return (data || []).map((purchase) => ({
    id: purchase.id,
    usuario:
      purchase.usuarios_app?.nombre ||
      purchase.usuarios_app?.email ||
      "Usuario registrado",
    usuario_email: purchase.usuarios_app?.email,
    usuario_app_id: purchase.usuario_app_id,
    cantidad: purchase.cantidad,
    total: purchase.total,
    fecha_compra: purchase.fecha_compra,
    metodo_pago: purchase.metodo_pago,
    estado_pago: purchase.estado_pago,
    referencia_pago: purchase.referencia_pago,
    pago_ultimos4: purchase.pago_ultimos4,
    tipo_boleta_id: purchase.tipos_boletas?.id || purchase.tipo_boleta_id,
    tipo_boleta: purchase.tipos_boletas?.tipo,
    precio: purchase.tipos_boletas?.precio,
    evento_id: purchase.tipos_boletas?.evento_id,
    evento_nombre: purchase.tipos_boletas?.eventos?.nombre,
    evento_fecha: purchase.tipos_boletas?.eventos?.fecha,
    evento_lugar: purchase.tipos_boletas?.eventos?.lugar,
    estado: purchase.estado,
    source: "compra_usuario",
  }));
}

async function getTicketTypeIdsForEvent(supabase, eventId) {
  if (!eventId) {
    return null;
  }

  const { data: ticketTypes, error } = await supabase
    .from("tipos_boletas")
    .select("id")
    .eq("evento_id", eventId);

  if (error) {
    throw new Error(`Error filtering sales: ${error.message}`);
  }

  return (ticketTypes || []).map((ticketType) => ticketType.id);
}

async function createSale(saleData) {
  const supabase = getSupabase();

  // Get ticket type to verify it exists and get the price
  const { data: ticketType, error: ticketError } = await supabase
    .from("tipos_boletas")
    .select("precio, cantidad_disponible")
    .eq("id", saleData.tipo_boleta_id)
    .single();

  if (ticketError || !ticketType) {
    throw new Error("Ticket type not found");
  }

  if (Number(ticketType.cantidad_disponible) < Number(saleData.cantidad)) {
    const error = new Error("No hay suficientes boletas disponibles para completar la venta.");
    error.status = 400;
    throw error;
  }

  const total = Number(ticketType.precio) * Number(saleData.cantidad);

  // Create the sale
  const { data: saleResult, error: saleError } = await supabase
    .from("ventas")
    .insert([
      {
        usuario: saleData.usuario,
        tipo_boleta_id: saleData.tipo_boleta_id,
        cantidad: saleData.cantidad,
        total: total,
      },
    ])
    .select("id")
    .single();

  if (saleError) {
    throw new Error(`Error creating sale: ${saleError.message}`);
  }

  const { error: stockError } = await supabase
    .from("tipos_boletas")
    .update({
      cantidad_disponible:
        Number(ticketType.cantidad_disponible) - Number(saleData.cantidad),
      actualizado_en: new Date().toISOString(),
    })
    .eq("id", saleData.tipo_boleta_id);

  if (stockError) {
    throw new Error(`Error updating ticket stock: ${stockError.message}`);
  }

  // Fetch the created sale with all details
  const { data: fullSale, error: fetchError } = await supabase
    .from("ventas")
    .select(
      `id,
       usuario,
       cantidad,
       total,
       fecha_compra,
       tipos_boletas(tipo),
       eventos:tipos_boletas(evento_id, eventos(nombre))`
    )
    .eq("id", saleResult.id)
    .single();

  if (fetchError) {
    throw new Error(`Error fetching sale: ${fetchError.message}`);
  }

  return {
    id: fullSale.id,
    usuario: fullSale.usuario,
    cantidad: fullSale.cantidad,
    total: fullSale.total,
    fecha_compra: fullSale.fecha_compra,
    tipo_boleta: fullSale.tipos_boletas?.tipo,
    evento_nombre: fullSale.eventos?.[0]?.eventos?.nombre,
  };
}

module.exports = {
  createSale,
  listSales,
};
