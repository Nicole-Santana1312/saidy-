// User Dashboard - Historial de compras
async function loadPurchases() {
  const container = document.getElementById("purchases-container");

  try {
    const response = await fetch("/api/user/compras", {
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      if (response.status === 401) {
        window.location.href = "/user/login";
        return;
      }
      throw new Error("Error al cargar compras");
    }

    const data = await response.json();

    if (!data.purchases || data.purchases.length === 0) {
      container.innerHTML = '<p class="empty-state">No tienes compras aún.</p>';
      return;
    }

    container.innerHTML = data.purchases
      .map(
        (purchase) => `
      <article class="purchase-card">
        <h3>${escapeHtml(purchase.evento_nombre)}</h3>
        <div class="purchase-details">
          <p><strong>Tipo:</strong> ${escapeHtml(purchase.tipo_boleta)}</p>
          <p><strong>Cantidad:</strong> ${purchase.cantidad} boleta(s)</p>
          <p><strong>Total:</strong> RD$ ${Number(purchase.total).toFixed(2)}</p>
          <p><strong>Fecha:</strong> ${formatDate(purchase.fecha_compra)}</p>
          <p><strong>Estado:</strong> <span class="badge">${purchase.estado}</span></p>
          <p><strong>Pago:</strong> ${formatPayment(purchase)}</p>
        </div>
      </article>
    `
      )
      .join("");
  } catch (error) {
    container.innerHTML = `<p class="error">Error: ${escapeHtml(error.message)}</p>`;
  }
}

function formatPayment(purchase) {
  if (!purchase.metodo_pago) {
    return "No registrado";
  }

  const last4 = purchase.pago_ultimos4 ? ` **** ${escapeHtml(purchase.pago_ultimos4)}` : "";
  return `${escapeHtml(formatPaymentMethod(purchase.metodo_pago))}${last4} - ${escapeHtml(purchase.estado_pago || "pendiente")}`;
}

function formatPaymentMethod(value) {
  const labels = {
    tarjeta: "Tarjeta",
  };

  return labels[value] || value;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("es-DO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

loadPurchases();
