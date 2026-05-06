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

  const { data: sales, error } = await supabase.from("ventas").select("total, cantidad");

  if (error) {
    throw new Error(`Error getting report summary: ${error.message}`);
  }

  const summary = (sales || []).reduce(
    (acc, sale) => ({
      ingresos_totales: acc.ingresos_totales + Number(sale.total),
      boletas_vendidas: acc.boletas_vendidas + Number(sale.cantidad),
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
