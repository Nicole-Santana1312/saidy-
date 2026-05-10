const totalIncome = document.querySelector("[data-total-income]");
const totalTickets = document.querySelector("[data-total-tickets]");
const totalSales = document.querySelector("[data-total-sales]");
const reportChart = document.querySelector("[data-report-chart]");
const reportTableBody = document.querySelector("[data-report-table-body]");
let revenueChart;

async function loadReports() {
  const response = await fetch("/api/reportes", {
    headers: { Accept: "application/json" },
  });
  const data = await response.json();

  renderSummary(data.summary || {});
  renderChart(data.revenueByEvent || []);
  renderTable(data.revenueByEvent || []);
}

function renderSummary(summary) {
  totalIncome.textContent = formatCurrency(summary.ingresos_totales || 0);
  totalTickets.textContent = Number(summary.boletas_vendidas || 0).toLocaleString("es-DO");
  totalSales.textContent = Number(summary.total_ventas || 0).toLocaleString("es-DO");
}

function renderChart(rows) {
  if (rows.length === 0) {
    reportChart.innerHTML = '<p class="empty-state">No hay eventos para reportar.</p>';
    return;
  }

  reportChart.innerHTML = '<canvas id="revenueChart" aria-label="Ingresos por evento"></canvas>';

  if (revenueChart) {
    revenueChart.destroy();
  }

  revenueChart = new Chart(document.querySelector("#revenueChart"), {
    type: "bar",
    data: {
      labels: rows.map((row) => row.evento_nombre),
      datasets: [
        {
          label: "Ingresos",
          data: rows.map((row) => Number(row.ingresos)),
          backgroundColor: "#176b87",
          borderColor: "#004562",
          borderWidth: 1,
        },
        {
          label: "Boletas vendidas",
          data: rows.map((row) => Number(row.boletas_vendidas)),
          backgroundColor: "#f7b500",
          borderColor: "#d95d39",
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}

function renderTable(rows) {
  if (rows.length === 0) {
    reportTableBody.innerHTML = `
      <tr>
        <td colspan="6" class="empty-table">No hay datos disponibles.</td>
      </tr>
    `;
    return;
  }

  reportTableBody.innerHTML = rows.map(renderReportRow).join("");
}

function renderReportRow(row) {
  return `
    <tr>
      <td><strong>${escapeHtml(row.evento_nombre)}</strong></td>
      <td>${formatDate(row.evento_fecha)}</td>
      <td>${escapeHtml(row.evento_lugar)}</td>
      <td>${formatCurrency(row.ingresos)}</td>
      <td>${Number(row.boletas_vendidas).toLocaleString("es-DO")}</td>
      <td>${Number(row.total_ventas).toLocaleString("es-DO")}</td>
    </tr>
  `;
}

function formatCurrency(value) {
  return new Intl.NumberFormat("es-DO", {
    style: "currency",
    currency: "DOP",
  }).format(Number(value));
}

function formatDate(value) {
  return new Intl.DateTimeFormat("es-DO", {
    dateStyle: "medium",
  }).format(new Date(`${value}T00:00:00`));
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

loadReports();
