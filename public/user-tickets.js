// User Tickets Page - Visualización de boletos
const ticketsContainer = document.getElementById("tickets-container");

async function loadTickets() {
  try {
    const response = await fetch("/api/user/boletos", {
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      if (response.status === 401) {
        window.location.href = "/user/login";
        return;
      }
      throw new Error("Error al cargar boletos");
    }

    const data = await response.json();

    if (!data.tickets || data.tickets.length === 0) {
      ticketsContainer.innerHTML =
        '<p class="empty-state">No tienes boletos aún. <a href="/user/eventos">Compra aquí</a></p>';
      return;
    }

    // Agrupar boletos por evento
    const ticketsByEvent = {};
    data.tickets.forEach((ticket) => {
      if (!ticketsByEvent[ticket.evento_nombre]) {
        ticketsByEvent[ticket.evento_nombre] = [];
      }
      ticketsByEvent[ticket.evento_nombre].push(ticket);
    });

    let html = "";

    Object.entries(ticketsByEvent).forEach(([eventName, tickets]) => {
      html += `<h3>${escapeHtml(eventName)}</h3>`;
      html += '<div class="tickets-grid">';

      tickets.forEach((ticket) => {
        const statusClass =
          ticket.estado === "usado"
            ? "used"
            : ticket.estado === "cancelado"
              ? "cancelled"
              : "available";

        html += `
        <article class="ticket-card ${statusClass}">
          <div class="ticket-header">
            <span class="ticket-type">${escapeHtml(ticket.tipo)}</span>
            <span class="ticket-status">${ticket.estado.toUpperCase()}</span>
          </div>
          <div class="ticket-code">
            <p>Código:</p>
            <code>${escapeHtml(ticket.codigo_unico)}</code>
          </div>
          <div class="ticket-details">
            <p><strong>Evento:</strong> ${escapeHtml(ticket.evento_nombre)}</p>
            <p><strong>Fecha:</strong> ${formatDate(ticket.evento_fecha)}</p>
            <p><strong>Lugar:</strong> ${escapeHtml(ticket.evento_lugar)}</p>
            <p><strong>Asiento:</strong> Fila ${escapeHtml(ticket.fila || "A")} asiento ${escapeHtml(ticket.asiento || "")}</p>
            <p><strong>Precio:</strong> RD$ ${ticket.precio.toFixed(2)}</p>
            <p><strong>Comprado:</strong> ${formatDate(ticket.fecha_compra)}</p>
            ${
              ticket.estado === "usado"
                ? `<p><strong>Validado:</strong> ${formatDate(ticket.fecha_validacion)}</p>`
                : ""
            }
          </div>
        </article>
      `;
      });

      html += "</div>";
    });

    ticketsContainer.innerHTML = html;
  } catch (error) {
    ticketsContainer.innerHTML = `<p class="error">Error: ${escapeHtml(error.message)}</p>`;
  }
}

function generateQR(codigo_unico) {
  // Para una solución simple, mostrar el código
  alert(`Código del boleto: ${codigo_unico}\n\nEste código será escaneado en la entrada del evento.`);

  // En producción, usar una librería como qrcode.js para generar QR real
  // Ejemplo:
  // const qr = new QRCode(document.getElementById("qr"), {
  //   text: codigo_unico,
  //   width: 200,
  //   height: 200,
  // });
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("es-DO", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

loadTickets();
