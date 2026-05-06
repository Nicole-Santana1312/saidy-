const ticketForm = document.querySelector("[data-ticket-form]");
const eventSelect = document.querySelector("[data-event-select]");
const eventFilter = document.querySelector("[data-event-filter]");
const ticketList = document.querySelector("[data-ticket-list]");
const ticketMessage = document.querySelector("[data-ticket-message]");
const resetTicketButton = document.querySelector("[data-reset-ticket-form]");
const ticketSubmitButton = document.querySelector("[data-ticket-submit]");
const ticketFormTitle = document.querySelector("#ticket-form-title");

let events = [];

async function loadEventsForTickets() {
  try {
    const response = await fetch("/api/eventos", {
      headers: { Accept: "application/json" },
    });
    const data = await readJsonResponse(response);

    if (!response.ok) {
      throw new Error(data.message || "No se pudieron cargar los eventos.");
    }

    events = data.events || [];
  } catch (error) {
    showTicketMessage(`Error: ${error.message}`, true);
    events = [];
  }

  renderEventOptions();

  if (events.length > 0) {
    await loadTicketTypes(eventFilter.value);
  } else {
    ticketList.innerHTML =
      '<p class="empty-state">Primero crea un evento para asignarle boletas.</p>';
  }
}

function renderEventOptions() {
  if (events.length === 0) {
    eventSelect.innerHTML = '<option value="">No hay eventos disponibles</option>';
    eventFilter.innerHTML = '<option value="">No hay eventos disponibles</option>';
    return;
  }

  const options = events
    .map((event) => `<option value="${event.id}">${escapeHtml(event.nombre)}</option>`)
    .join("");

  eventSelect.innerHTML = options;
  eventFilter.innerHTML = options;
}

async function loadTicketTypes(eventId) {
  if (!eventId) {
    ticketList.innerHTML =
      '<p class="empty-state">Selecciona un evento para ver sus boletas.</p>';
    return;
  }

  try {
    const response = await fetch(`/api/eventos/${eventId}/boletas`, {
      headers: { Accept: "application/json" },
    });
    const data = await readJsonResponse(response);

    if (!response.ok) {
      throw new Error(data.message || "No se pudieron cargar las boletas.");
    }

    renderTicketTypes(data.ticketTypes || []);
  } catch (error) {
    ticketList.innerHTML = `<p class="empty-state">Error: ${escapeHtml(error.message)}</p>`;
  }
}

function renderTicketTypes(ticketTypes) {
  if (ticketTypes.length === 0) {
    ticketList.innerHTML =
      '<p class="empty-state">Este evento todavia no tiene tipos de boletas.</p>';
    return;
  }

  ticketList.innerHTML = ticketTypes.map(renderTicketTypeCard).join("");
}

function renderTicketTypeCard(ticketType) {
  return `
    <article class="ticket-type-card">
      <div>
        <span class="ticket-badge">${escapeHtml(ticketType.tipo)}</span>
        <h3>${escapeHtml(ticketType.evento_nombre)}</h3>
      </div>
      <dl>
        <div>
          <dt>Precio</dt>
          <dd>${formatCurrency(ticketType.precio)}</dd>
        </div>
        <div>
          <dt>Disponibles</dt>
          <dd>${Number(ticketType.cantidad_disponible).toLocaleString("es-DO")}</dd>
        </div>
        <div>
          <dt>Vendidas</dt>
          <dd>${Number(ticketType.cantidad_vendida || 0).toLocaleString("es-DO")}</dd>
        </div>
      </dl>
      <div class="event-card-actions">
        <button type="button" class="compact-button" data-ticket-edit="${ticketType.id}">Editar</button>
        <button type="button" class="compact-button danger" data-ticket-delete="${ticketType.id}">Eliminar</button>
      </div>
    </article>
  `;
}

async function handleTicketSubmit(event) {
  event.preventDefault();
  setTicketSubmitState(true);

  try {
    const formData = new FormData(ticketForm);
    const id = formData.get("id");
    const payload = {
      evento_id: formData.get("evento_id"),
      tipo: formData.get("tipo"),
      precio: formData.get("precio"),
      cantidad_disponible: formData.get("cantidad_disponible"),
    };

    const url = id ? `/api/boletas/${id}` : "/api/boletas";
    const method = id ? "PUT" : "POST";
    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await readJsonResponse(response);

    if (!response.ok) {
      showTicketMessage(data.errors ? data.errors.join(" ") : data.message, true);
      return;
    }

    showTicketMessage(data.message, false);
    eventFilter.value = payload.evento_id;
    resetTicketForm();
    await loadTicketTypes(eventFilter.value);
  } catch (error) {
    showTicketMessage(`Error: ${error.message}`, true);
  } finally {
    setTicketSubmitState(false);
  }
}

async function handleTicketListClick(event) {
  const editId = event.target.dataset.ticketEdit;
  const deleteId = event.target.dataset.ticketDelete;

  if (editId) {
    await fillTicketFormForEdit(editId);
  }

  if (deleteId) {
    await removeTicketType(deleteId);
  }
}

async function fillTicketFormForEdit(id) {
  try {
    const response = await fetch(`/api/boletas/${id}`, {
      headers: { Accept: "application/json" },
    });
    const data = await readJsonResponse(response);

    if (!response.ok) {
      showTicketMessage(data.message, true);
      return;
    }

    ticketForm.elements.id.value = data.ticketType.id;
    ticketForm.elements.evento_id.value = data.ticketType.evento_id;
    ticketForm.elements.tipo.value = data.ticketType.tipo;
    ticketForm.elements.precio.value = data.ticketType.precio;
    ticketForm.elements.cantidad_disponible.value =
      data.ticketType.cantidad_disponible;
    ticketSubmitButton.textContent = "Actualizar boleta";
    ticketFormTitle.textContent = "Editar tipo de boleta";
    window.scrollTo({ top: 0, behavior: "smooth" });
  } catch (error) {
    showTicketMessage(`Error: ${error.message}`, true);
  }
}

async function removeTicketType(id) {
  const shouldDelete = window.confirm("Seguro que deseas eliminar este tipo de boleta?");

  if (!shouldDelete) {
    return;
  }

  try {
    const response = await fetch(`/api/boletas/${id}`, {
      method: "DELETE",
      headers: { Accept: "application/json" },
    });
    const data = await readJsonResponse(response);

    showTicketMessage(data.message, !response.ok);
    await loadTicketTypes(eventFilter.value);
  } catch (error) {
    showTicketMessage(`Error: ${error.message}`, true);
  }
}

function resetTicketForm() {
  const selectedEventId = eventSelect.value;
  ticketForm.reset();
  ticketForm.elements.id.value = "";
  eventSelect.value = selectedEventId || eventFilter.value;
  ticketSubmitButton.textContent = "Guardar boleta";
  ticketFormTitle.textContent = "Crear tipo de boleta";
}

function showTicketMessage(message, isError) {
  ticketMessage.hidden = false;
  ticketMessage.textContent = message || "Ocurrio un error inesperado.";
  ticketMessage.classList.toggle("error", isError);
  ticketMessage.scrollIntoView({ behavior: "smooth", block: "center" });
}

function setTicketSubmitState(isSaving) {
  ticketSubmitButton.disabled = isSaving;
  ticketSubmitButton.textContent = isSaving
    ? "Guardando..."
    : ticketForm.elements.id.value
      ? "Actualizar boleta"
      : "Guardar boleta";
}

async function readJsonResponse(response) {
  const text = await response.text();

  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    throw new Error("El servidor respondio con un formato inesperado. Revisa si la sesion sigue activa.");
  }
}

function formatCurrency(value) {
  return new Intl.NumberFormat("es-DO", {
    style: "currency",
    currency: "DOP",
  }).format(Number(value));
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

ticketForm.addEventListener("submit", handleTicketSubmit);
ticketList.addEventListener("click", handleTicketListClick);
resetTicketButton.addEventListener("click", resetTicketForm);
eventFilter.addEventListener("change", () => loadTicketTypes(eventFilter.value));
loadEventsForTickets();
