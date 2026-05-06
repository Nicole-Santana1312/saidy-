const { getSupabase } = require("../config/database");

async function getRevenueByEvent() {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("reportes_por_evento")
    .select("*")
    .order("ingresos", { ascending: false })
    .order("boletas_vendidas", { ascending: false })
    .order("evento_fecha", { ascending: true });

  if (error) {
    throw new Error(`Error getting revenue by event: ${error.message}`);
  }

  return data || [];
}

async function getReportSummary() {
  const supabase = getSupabase();

  const [
    { data: purchases, error: purchaseError },
    { data: sales, error: salesError },
  ] = await Promise.all([
    supabase
      .from("compras")
      .select("total, cantidad")
      .eq("estado", "completada")
      .eq("estado_pago", "pagado"),
    supabase.from("ventas").select("total, cantidad"),
  ]);

  if (purchaseError) {
    throw new Error(`Error getting purchase report summary: ${purchaseError.message}`);
  }

  if (salesError) {
    throw new Error(`Error getting sales report summary: ${salesError.message}`);
  }

  const completedSales = [...(purchases || []), ...(sales || [])];

  const summary = completedSales.reduce(
    (acc, item) => ({
      ingresos_totales: acc.ingresos_totales + Number(item.total),
      boletas_vendidas: acc.boletas_vendidas + Number(item.cantidad),
      total_ventas: acc.total_ventas + 1,
    }),
    { ingresos_totales: 0, boletas_vendidas: 0, total_ventas: 0 }
  );

  return summary;
}

module.exports = {
  getReportSummary,
  getRevenueByEvent,
};
