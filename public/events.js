const form = document.querySelector("[data-event-form]");
const eventsList = document.querySelector("[data-events-list]");
const messageBox = document.querySelector("[data-form-message]");
const resetButton = document.querySelector("[data-reset-form]");
const submitButton = document.querySelector("[data-submit-button]");
const formTitle = document.querySelector("#form-title");

async function loadEvents() {
  const response = await fetch("/api/eventos", {
    headers: { Accept: "application/json" },
  });
  const data = await response.json();

  renderEvents(data.events || []);
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
        <p>${escapeHtml(event.lugar)}</p>
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

  const formData = new FormData(form);
  const id = formData.get("id");
  const payload = {
    nombre: formData.get("nombre").trim(),
    fecha: formData.get("fecha"),
    lugar: formData.get("lugar").trim(),
    descripcion: formData.get("descripcion").trim(),
    imagen: formData.get("imagen").trim(),
  };

  const url = id ? `/api/eventos/${id}` : "/api/eventos";
  const method = id ? "PUT" : "POST";
  const response = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await response.json();

  if (!response.ok) {
    showMessage(data.errors ? data.errors.join(" ") : data.message, true);
    return;
  }

  showMessage(data.message, false);
  resetForm();
  await loadEvents();
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
  const response = await fetch(`/api/eventos/${id}`, {
    headers: { Accept: "application/json" },
  });
  const data = await response.json();

  if (!response.ok) {
    showMessage(data.message, true);
    return;
  }

  form.elements.id.value = data.event.id;
  form.elements.nombre.value = data.event.nombre;
  form.elements.fecha.value = data.event.fecha.slice(0, 10);
  form.elements.lugar.value = data.event.lugar;
  form.elements.descripcion.value = data.event.descripcion;
  form.elements.imagen.value = data.event.imagen;
  submitButton.textContent = "Actualizar evento";
  formTitle.textContent = "Editar evento";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function removeEvent(id) {
  const shouldDelete = window.confirm("Seguro que deseas eliminar este evento?");

  if (!shouldDelete) {
    return;
  }

  const response = await fetch(`/api/eventos/${id}`, {
    method: "DELETE",
    headers: { Accept: "application/json" },
  });
  const data = await response.json();

  showMessage(data.message, !response.ok);
  await loadEvents();
}

function resetForm() {
  form.reset();
  form.elements.id.value = "";
  submitButton.textContent = "Guardar evento";
  formTitle.textContent = "Crear evento";
}

function showMessage(message, isError) {
  messageBox.hidden = false;
  messageBox.textContent = message;
  messageBox.classList.toggle("error", isError);
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
loadEvents();
