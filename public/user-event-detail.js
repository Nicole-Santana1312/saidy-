const layout = document.querySelector("[data-event-id]");
const eventDetail = document.getElementById("event-detail");
const purchaseForm = document.getElementById("purchase-form");
const ticketTypeSelect = document.getElementById("ticket-type");
const ticketQuantity = document.getElementById("ticket-quantity");
const totalPrice = document.getElementById("total-price");
const purchaseMessage = document.getElementById("purchase-message");
const paymentMethod = document.getElementById("payment-method");
const cardholderName = document.getElementById("cardholder-name");
const cardNumber = document.getElementById("card-number");
const cardExpiry = document.getElementById("card-expiry");
const cardCvv = document.getElementById("card-cvv");

const eventId = layout.dataset.eventId;
let ticketTypes = [];

async function loadEventDetail() {
  try {
    const [eventResponse, ticketResponse] = await Promise.all([
      fetch(`/api/eventos-publicos/${eventId}`, { headers: { Accept: "application/json" } }),
      fetch(`/api/eventos-publicos/${eventId}/tipos-boletas`, { headers: { Accept: "application/json" } }),
    ]);

    if (!eventResponse.ok) {
      throw new Error("Este evento no esta disponible.");
    }

    const eventData = await eventResponse.json();
    const ticketData = ticketResponse.ok ? await ticketResponse.json() : { ticketTypes: [] };
    ticketTypes = ticketData.ticketTypes || [];

    renderEvent(eventData.event);
    renderTicketTypes();
    updateTotalPrice();
  } catch (error) {
    eventDetail.innerHTML = `<p class="empty-state">Error: ${escapeHtml(error.message)}</p>`;
    purchaseForm.hidden = true;
  }
}

function renderEvent(event) {
  eventDetail.innerHTML = `
    <div class="event-detail-media">
      <img src="${escapeHtml(event.imagen)}" alt="${escapeHtml(event.nombre)}" />
    </div>
    <div>
      <p class="eyebrow">${formatCategory(event.categoria)}</p>
      <h1>${escapeHtml(event.nombre)}</h1>
      <p>${formatDate(event.fecha)} - ${escapeHtml(event.hora || "")}</p>
      <p>${escapeHtml(event.lugar)}</p>
      <p>${escapeHtml(event.descripcion)}</p>
      <a class="link-button" href="/user/eventos">Volver a eventos</a>
    </div>
  `;
}

function renderTicketTypes() {
  if (ticketTypes.length === 0) {
    ticketTypeSelect.innerHTML = '<option value="">No hay boletas disponibles</option>';
    purchaseForm.querySelector("button[type='submit']").disabled = true;
    return;
  }

  ticketTypeSelect.innerHTML = ticketTypes
    .map(
      (ticketType) => `
        <option value="${ticketType.id}" data-price="${Number(ticketType.precio)}" data-stock="${Number(ticketType.cantidad_disponible)}">
          ${escapeHtml(ticketType.tipo)} - ${formatCurrency(ticketType.precio)} (${Number(ticketType.cantidad_disponible).toLocaleString("es-DO")} disponibles)
        </option>
      `
    )
    .join("");
  purchaseForm.querySelector("button[type='submit']").disabled = false;
}

function updateTotalPrice() {
  const selectedOption = ticketTypeSelect.selectedOptions[0];

  if (!selectedOption || !selectedOption.value) {
    totalPrice.textContent = formatCurrency(0);
    return;
  }

  const stock = Number(selectedOption.dataset.stock || 1);
  ticketQuantity.max = String(Math.min(stock, 10));

  if (Number(ticketQuantity.value) > Number(ticketQuantity.max)) {
    ticketQuantity.value = ticketQuantity.max;
  }

  const price = Number(selectedOption.dataset.price || 0);
  const quantity = Number(ticketQuantity.value || 1);
  totalPrice.textContent = formatCurrency(price * quantity);
}

purchaseForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const submitButton = purchaseForm.querySelector("button[type='submit']");
  submitButton.disabled = true;
  submitButton.textContent = "Procesando...";

  try {
    const response = await fetch("/api/user/compras", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        tipo_boleta_id: ticketTypeSelect.value,
        cantidad: Number(ticketQuantity.value),
        payment_method: paymentMethod.value,
        cardholder_name: cardholderName.value,
        card_number: cardNumber.value,
        card_expiry: cardExpiry.value,
        card_cvv: cardCvv.value,
      }),
    });
    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data.errors?.[0] || data.message || "No se pudo completar la compra.";
      throw new Error(errorMessage);
    }

    showMessage(data.message || "Compra realizada correctamente. Revisa tu correo y tus boletos.", false);
    await loadEventDetail();
    setTimeout(() => {
      window.location.href = "/user/boletos";
    }, 1800);
  } catch (error) {
    showMessage(`Error: ${error.message}`, true);
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Comprar boletas";
  }
});

ticketTypeSelect.addEventListener("change", updateTotalPrice);
ticketQuantity.addEventListener("input", updateTotalPrice);
cardNumber.addEventListener("input", () => {
  const digits = cardNumber.value.replace(/\D/g, "").slice(0, 19);
  cardNumber.value = digits.replace(/(\d{4})(?=\d)/g, "$1 ");
});
cardExpiry.addEventListener("input", () => {
  const digits = cardExpiry.value.replace(/\D/g, "").slice(0, 4);
  cardExpiry.value = digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
});
cardCvv.addEventListener("input", () => {
  cardCvv.value = cardCvv.value.replace(/\D/g, "").slice(0, 4);
});

function showMessage(message, isError) {
  purchaseMessage.hidden = false;
  purchaseMessage.textContent = message;
  purchaseMessage.classList.toggle("error", isError);
  purchaseMessage.scrollIntoView({ behavior: "smooth", block: "center" });
}

function formatDate(dateString) {
  const date = new Date(`${dateString}T00:00:00`);
  return date.toLocaleDateString("es-DO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatCurrency(value) {
  return new Intl.NumberFormat("es-DO", {
    style: "currency",
    currency: "DOP",
  }).format(Number(value || 0));
}

function formatCategory(value) {
  const labels = {
    concierto: "Concierto",
    stand_up: "Stand up",
    actividad: "Actividad",
  };

  return labels[value] || "Evento";
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

loadEventDetail();
