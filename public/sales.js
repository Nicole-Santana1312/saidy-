const saleEventFilter = document.querySelector("[data-sale-event-filter]");
const salesTableBody = document.querySelector("[data-sales-table-body]");

async function loadSaleEvents() {
  const response = await fetch("/api/eventos", {
    headers: { Accept: "application/json" },
  });
  const data = await response.json();

  const options = (data.events || [])
    .map((event) => `<option value="${event.id}">${escapeHtml(event.nombre)}</option>`)
    .join("");

  saleEventFilter.innerHTML = `<option value="">Todos los eventos</option>${options}`;
}

async function loadSales() {
  const params = new URLSearchParams();

  if (saleEventFilter.value) {
    params.set("evento_id", saleEventFilter.value);
  }

  const url = params.toString() ? `/api/ventas?${params}` : "/api/ventas";
  const response = await fetch(url, {
    headers: { Accept: "application/json" },
  });
  const data = await response.json();

  renderSales(data.sales || []);
}

function renderSales(sales) {
  if (sales.length === 0) {
    salesTableBody.innerHTML = `
      <tr>
        <td colspan="7" class="empty-table">No hay ventas para mostrar.</td>
      </tr>
    `;
    return;
  }

  salesTableBody.innerHTML = sales.map(renderSaleRow).join("");
}

function renderSaleRow(sale) {
  return `
    <tr>
      <td>${escapeHtml(sale.usuario)}</td>
      <td>
        <strong>${escapeHtml(sale.evento_nombre)}</strong>
        <span class="muted-cell">${escapeHtml(sale.evento_lugar)}</span>
      </td>
      <td><span class="pill">${escapeHtml(sale.tipo_boleta)}</span></td>
      <td>${Number(sale.cantidad).toLocaleString("es-DO")}</td>
      <td>${formatCurrency(sale.total)}</td>
      <td>${formatPayment(sale)}</td>
      <td>${formatDateTime(sale.fecha_compra)}</td>
    </tr>
  `;
}

function formatPayment(sale) {
  if (!sale.metodo_pago) {
    return '<span class="muted-cell">Venta manual</span>';
  }

  const card = sale.pago_ultimos4 ? ` **** ${escapeHtml(sale.pago_ultimos4)}` : "";
  const reference = sale.referencia_pago
    ? `<span class="muted-cell">${escapeHtml(sale.referencia_pago)}</span>`
    : "";

  return `<strong>${escapeHtml(formatPaymentMethod(sale.metodo_pago))}${card}</strong>${reference}`;
}

function formatPaymentMethod(value) {
  const labels = {
    tarjeta: "Tarjeta",
  };

  return labels[value] || value;
}

function formatCurrency(value) {
  return new Intl.NumberFormat("es-DO", {
    style: "currency",
    currency: "DOP",
  }).format(Number(value));
}

function formatDateTime(value) {
  return new Intl.DateTimeFormat("es-DO", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value.replace(" ", "T")));
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

saleEventFilter.addEventListener("change", loadSales);

loadSaleEvents().then(loadSales);
