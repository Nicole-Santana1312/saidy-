// Admin Check-in Page - Validación de boletos
const checkinForm = document.getElementById("checkin-form");
const codigoInput = document.getElementById("codigo_boleto");
const checkinMessage = document.getElementById("checkin-message");
const ticketInfo = document.getElementById("ticket-info");

checkinForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const codigo = codigoInput.value.trim();

  if (!codigo) {
    showMessage("Por favor ingresa un código.", true);
    return;
  }

  try {
    const response = await fetch("/api/check-in", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ codigo_unico: codigo }),
    });

    const data = await response.json();

    if (response.ok) {
      showMessage("✓ " + data.message, false);
      displayTicketInfo(data.ticket);
      codigoInput.value = "";
      codigoInput.focus();
    } else {
      showMessage("✗ " + data.message, true);
      ticketInfo.style.display = "none";
    }
  } catch (error) {
    showMessage(`Error: ${error.message}`, true);
  }
});

function displayTicketInfo(ticket) {
  document.getElementById("info-tipo").textContent = escapeHtml(ticket.tipo_boleta);
  document.getElementById("info-estado").textContent = ticket.estado.toUpperCase();
  document.getElementById("info-usuario").textContent = escapeHtml(ticket.usuario_nombre);
  document.getElementById("info-email").textContent = escapeHtml(ticket.usuario_email);
  document.getElementById("info-evento").textContent = escapeHtml(ticket.evento_nombre);
  document.getElementById("info-fecha").textContent = formatDate(ticket.evento_fecha);
  document.getElementById("info-lugar").textContent = escapeHtml(ticket.evento_lugar);
  document.getElementById("info-boleta-tipo").textContent = escapeHtml(ticket.tipo_boleta);
  document.getElementById("info-fila").textContent = escapeHtml(ticket.fila || "A");
  document.getElementById("info-asiento").textContent = escapeHtml(ticket.asiento || "");
  document.getElementById("info-codigo").textContent = escapeHtml(ticket.codigo_unico);
  document.getElementById("info-validacion").textContent = ticket.fecha_validacion
    ? formatDate(ticket.fecha_validacion)
    : "No validado";

  ticketInfo.style.display = "block";
}

function showMessage(message, isError) {
  checkinMessage.textContent = message;
  checkinMessage.className = isError ? "alert" : "success-message";
  checkinMessage.removeAttribute("hidden");

  if (!isError) {
    setTimeout(() => {
      checkinMessage.setAttribute("hidden", "");
    }, 3000);
  }
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
