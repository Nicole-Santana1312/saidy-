const eventsContainer = document.getElementById("events-container");

async function loadEvents() {
  try {
    const [eventsResponse, ticketsResponse] = await Promise.all([
      fetch("/api/eventos-publicos", { headers: { Accept: "application/json" } }),
      fetch("/api/user/boletos", { headers: { Accept: "application/json" } }),
    ]);

    if (!eventsResponse.ok) {
      throw new Error("Error al cargar eventos");
    }

    const eventsData = await eventsResponse.json();
    const ticketsData = ticketsResponse.ok ? await ticketsResponse.json() : { tickets: [] };
    const ownedEventIds = new Set(
      (ticketsData.tickets || []).map((ticket) => ticket.evento_id)
    );

    if (!eventsData.events || eventsData.events.length === 0) {
      eventsContainer.innerHTML = '<p class="empty-state">No hay eventos disponibles.</p>';
      return;
    }

    eventsContainer.innerHTML = eventsData.events.map((event) => renderEventCard(event, ownedEventIds)).join("");
  } catch (error) {
    eventsContainer.innerHTML = `<p class="empty-state">Error: ${escapeHtml(error.message)}</p>`;
  }
}

function renderEventCard(event, ownedEventIds) {
  const hasTickets = ownedEventIds.has(event.id);

  return `
    <article class="event-card">
      ${hasTickets ? '<span class="owned-ticket-badge">Tienes boletas para esta actividad</span>' : ""}
      <img src="${escapeHtml(event.imagen)}" alt="${escapeHtml(event.nombre)}" />
      <div class="event-card-body">
        <span>${formatDate(event.fecha)}</span>
        <h3>${escapeHtml(event.nombre)}</h3>
        <p><strong>Lugar:</strong> ${escapeHtml(event.lugar)}</p>
        <p>${escapeHtml(event.descripcion.substring(0, 120))}${event.descripcion.length > 120 ? "..." : ""}</p>
        <a class="compact-button" href="/user/eventos/${event.id}">Ver evento</a>
      </div>
    </article>
  `;
}

function formatDate(dateString) {
  const date = new Date(`${dateString}T00:00:00`);
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

loadEvents();
