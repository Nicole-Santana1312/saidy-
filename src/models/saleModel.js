const { getSupabase } = require("../config/database");

async function listSales(eventId) {
  const supabase = getSupabase();

  let query = supabase.from("ventas").select(
    `id,
     usuario,
     cantidad,
     total,
     fecha_compra,
     tipos_boletas(id, tipo, precio),
     eventos:tipos_boletas(evento_id, eventos(id, nombre, fecha, lugar))`
  );

  if (eventId) {
    // This is a bit tricky with Supabase, we'll filter after getting data
    const { data: ticketTypes, error: ticketError } = await supabase
      .from("tipos_boletas")
      .select("id")
      .eq("evento_id", eventId);

    if (ticketError) {
      throw new Error(`Error filtering sales: ${ticketError.message}`);
    }

    const ticketIds = ticketTypes.map((t) => t.id);
    if (ticketIds.length === 0) {
      return [];
    }

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
    evento_id: sale.eventos?.[0]?.evento_id,
    evento_nombre: sale.eventos?.[0]?.eventos?.nombre,
    evento_fecha: sale.eventos?.[0]?.eventos?.fecha,
    evento_lugar: sale.eventos?.[0]?.eventos?.lugar,
  }));
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
