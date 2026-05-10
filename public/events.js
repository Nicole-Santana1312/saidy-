const form = document.querySelector("[data-event-form]");
const eventsList = document.querySelector("[data-events-list]");
const messageBox = document.querySelector("[data-form-message]");
const resetButton = document.querySelector("[data-reset-form]");
const submitButton = document.querySelector("[data-submit-button]");
const formTitle = document.querySelector("#form-title");
const ticketRows = document.querySelector("[data-ticket-rows]");
const addTicketRowButton = document.querySelector("[data-add-ticket-row]");
const ticketInlineSection = document.querySelector("[data-ticket-inline-section]");
const imageFileInput = document.querySelector("[data-image-file]");
const imagePreview = document.querySelector("[data-image-preview]");

async function loadEvents() {
  try {
    const response = await fetch("/api/eventos", {
      headers: { Accept: "application/json" },
    });
    const data = await readJsonResponse(response);

    if (!response.ok) {
      throw new Error(data.message || "No se pudieron cargar los eventos.");
    }

    renderEvents(data.events || []);
  } catch (error) {
    eventsList.innerHTML = `<p class="empty-state">Error: ${escapeHtml(error.message)}</p>`;
  }
}

function renderEvents(events) {
  if (events.length === 0) {
    eventsList.innerHTML = '<p class="empty-state">No hay eventos registrados.</p>';
    return;
  }

  eventsList.innerHTML = events.map(renderEventCard).join("");
}

function renderEventCard(event) {
  return `
    <article class="event-card">
      <img src="${escapeHtml(event.imagen)}" alt="${escapeHtml(event.nombre)}" />
      <div class="event-card-body">
        <span>${formatDate(event.fecha)}</span>
        <h3>${escapeHtml(event.nombre)}</h3>
        <p>${escapeHtml(event.lugar)} - ${escapeHtml(event.hora || "Hora pendiente")}</p>
        <p>${formatCategory(event.categoria)} - ${formatStatus(event.estado)}</p>
        <p>${escapeHtml(event.descripcion)}</p>
        <div class="event-card-actions">
          <button type="button" class="compact-button" data-edit-id="${event.id}">Editar</button>
          <button type="button" class="compact-button danger" data-delete-id="${event.id}">Eliminar</button>
        </div>
      </div>
    </article>
  `;
}

async function handleSubmit(event) {
  event.preventDefault();
  setSubmitState(true);

  try {
    const formData = new FormData(form);
    const id = formData.get("id");
    const payload = new FormData();
    payload.set("nombre", formData.get("nombre").trim());
    payload.set("fecha", formData.get("fecha"));
    payload.set("hora", formData.get("hora"));
    payload.set("lugar", formData.get("lugar").trim());
    payload.set("categoria", formData.get("categoria"));
    payload.set("estado", formData.get("estado"));
    payload.set("descripcion", formData.get("descripcion").trim());

    if (imageFileInput.files[0]) {
      payload.set("imagen_archivo", imageFileInput.files[0]);
    } else {
      payload.set("imagen", formData.get("imagen").trim());
    }

    if (!id) {
      const ticketTypes = getTicketTypePayload();

      if (ticketTypes.length === 0) {
        showMessage("Agrega al menos un tipo de boleta con precio, stock y tipo.", true);
        return;
      }

      payload.set("ticket_types", JSON.stringify(ticketTypes));
    }

    const url = id ? `/api/eventos/${id}` : "/api/eventos";
    const method = id ? "PUT" : "POST";
    const response = await fetch(url, {
      method,
      headers: { Accept: "application/json" },
      body: payload,
    });
    const data = await readJsonResponse(response);

    if (!response.ok) {
      showMessage(data.errors ? data.errors.join(" ") : data.message, true);
      return;
    }

    showMessage(data.message, false);
    resetForm();
    await loadEvents();
  } catch (error) {
    showMessage(`Error: ${error.message}`, true);
  } finally {
    setSubmitState(false);
  }
}

async function handleListClick(event) {
  const editId = event.target.dataset.editId;
  const deleteId = event.target.dataset.deleteId;

  if (editId) {
    await fillFormForEdit(editId);
  }

  if (deleteId) {
    await removeEvent(deleteId);
  }
}

async function fillFormForEdit(id) {
  try {
    const response = await fetch(`/api/eventos/${id}`, {
      headers: { Accept: "application/json" },
    });
    const data = await readJsonResponse(response);

    if (!response.ok) {
      showMessage(data.message, true);
      return;
    }

    form.elements.id.value = data.event.id;
    form.elements.nombre.value = data.event.nombre;
    form.elements.fecha.value = data.event.fecha.slice(0, 10);
    form.elements.hora.value = data.event.hora || "";
    form.elements.lugar.value = data.event.lugar;
    form.elements.categoria.value = data.event.categoria || "concierto";
    form.elements.estado.value = data.event.estado || "activo";
    form.elements.descripcion.value = data.event.descripcion;
    form.elements.imagen.value = data.event.imagen;
    updateImagePreview(data.event.imagen);
    ticketInlineSection.hidden = true;
    submitButton.textContent = "Actualizar evento";
    formTitle.textContent = "Editar evento";
    window.scrollTo({ top: 0, behavior: "smooth" });
  } catch (error) {
    showMessage(`Error: ${error.message}`, true);
  }
}

function formatCategory(value) {
  const labels = {
    concierto: "Concierto",
    stand_up: "Stand up",
    actividad: "Actividad",
  };

  return labels[value] || "Sin categoria";
}

function formatStatus(value) {
  const labels = {
    activo: "Activo",
    pausado: "Pausado",
    finalizado: "Finalizado",
  };

  return labels[value] || "Activo";
}

async function removeEvent(id) {
  const shouldDelete = window.confirm("Seguro que deseas eliminar este evento?");

  if (!shouldDelete) {
    return;
  }

  try {
    const response = await fetch(`/api/eventos/${id}`, {
      method: "DELETE",
      headers: { Accept: "application/json" },
    });
    const data = await readJsonResponse(response);

    showMessage(data.message, !response.ok);
    await loadEvents();
  } catch (error) {
    showMessage(`Error: ${error.message}`, true);
  }
}

function resetForm() {
  form.reset();
  form.elements.id.value = "";
  imagePreview.hidden = true;
  imagePreview.removeAttribute("src");
  ticketInlineSection.hidden = false;
  renderDefaultTicketRows();
  submitButton.textContent = "Guardar evento";
  formTitle.textContent = "Crear evento";
}

function renderDefaultTicketRows() {
  ticketRows.innerHTML = "";
  addTicketRow({ tipo: "General", precio: "", cantidad_disponible: "" });
}

function addTicketRow(values = {}) {
  const row = document.createElement("div");
  row.className = "ticket-inline-row";
  row.innerHTML = `
    <div>
      <label>Tipo</label>
      <input name="ticket_tipo" type="text" maxlength="60" placeholder="VIP, Platea, Palcos" value="${escapeHtml(values.tipo || "")}" required />
    </div>
    <div>
      <label>Precio</label>
      <input name="ticket_precio" type="number" min="0" step="0.01" placeholder="0.00" value="${escapeHtml(values.precio || "")}" required />
    </div>
    <div>
      <label>Stock</label>
      <input name="ticket_stock" type="number" min="1" step="1" placeholder="100" value="${escapeHtml(values.cantidad_disponible || "")}" required />
    </div>
    <button type="button" class="compact-button danger" data-remove-ticket-row>Eliminar</button>
  `;
  ticketRows.appendChild(row);
}

function readImageAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("Selecciona un archivo de imagen valido."));
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      reject(new Error("La imagen no puede pesar mas de 4 MB."));
      return;
    }

    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(reader.result));
    reader.addEventListener("error", () => reject(new Error("No se pudo leer la imagen.")));
    reader.readAsDataURL(file);
  });
}

function updateImagePreview(value) {
  if (!value) {
    imagePreview.hidden = true;
    imagePreview.removeAttribute("src");
    return;
  }

  imagePreview.src = value;
  imagePreview.hidden = false;
}

function handleImageFileChange() {
  const file = imageFileInput.files[0];

  if (!file) {
    return;
  }

  readImageAsDataUrl(file)
    .then((dataUrl) => {
      form.elements.imagen.value = "";
      updateImagePreview(dataUrl);
    })
    .catch((error) => {
      imageFileInput.value = "";
      showMessage(`Error: ${error.message}`, true);
    });
}

function getTicketTypePayload() {
  return Array.from(ticketRows.querySelectorAll(".ticket-inline-row"))
    .map((row) => ({
      tipo: row.querySelector('[name="ticket_tipo"]').value.trim(),
      precio: row.querySelector('[name="ticket_precio"]').value,
      cantidad_disponible: row.querySelector('[name="ticket_stock"]').value,
    }))
    .filter(
      (ticketType) =>
        ticketType.tipo &&
        Number(ticketType.precio) >= 0 &&
        Number(ticketType.cantidad_disponible) > 0
    );
}

function handleTicketRowsClick(event) {
  if (!Object.prototype.hasOwnProperty.call(event.target.dataset, "removeTicketRow")) {
    return;
  }

  const row = event.target.closest(".ticket-inline-row");

  if (ticketRows.children.length === 1) {
    row.querySelectorAll("input").forEach((input) => {
      input.value = "";
    });
    return;
  }

  row.remove();
}

function showMessage(message, isError) {
  messageBox.hidden = false;
  messageBox.textContent = message || "Ocurrio un error inesperado.";
  messageBox.classList.toggle("error", isError);
  messageBox.scrollIntoView({ behavior: "smooth", block: "center" });
}

function setSubmitState(isSaving) {
  submitButton.disabled = isSaving;
  submitButton.textContent = isSaving ? "Guardando..." : form.elements.id.value ? "Actualizar evento" : "Guardar evento";
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

function formatDate(value) {
  return new Intl.DateTimeFormat("es-DO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
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

form.addEventListener("submit", handleSubmit);
eventsList.addEventListener("click", handleListClick);
resetButton.addEventListener("click", resetForm);
addTicketRowButton.addEventListener("click", () => addTicketRow());
ticketRows.addEventListener("click", handleTicketRowsClick);
imageFileInput.addEventListener("change", handleImageFileChange);
form.elements.imagen.addEventListener("input", (event) => updateImagePreview(event.target.value.trim()));
renderDefaultTicketRows();
loadEvents();
