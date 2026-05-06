const nodemailer = require("nodemailer");
const env = require("../config/env");

function createTransporter() {
  if (!env.emailUser || !env.emailPassword) {
    throw new Error(
      "Email service is not configured. Set EMAIL_USER and EMAIL_PASSWORD in your .env file."
    );
  }

  return nodemailer.createTransport({
    host: env.emailHost,
    port: env.emailPort,
    secure: env.emailSecure,
    auth: {
      user: env.emailUser,
      pass: env.emailPassword,
    },
  });
}

async function sendEmail({ to, subject, text, html }) {
  const transporter = createTransporter();
  const message = {
    from: env.emailFrom,
    to,
    subject,
    text,
    html,
  };
  return transporter.sendMail(message);
}

async function sendVerificationEmail(to, name, verificationCode) {
  const subject = "Verifica tu cuenta en Eventix";
  const html = `
    <h2>Hola ${escapeHtml(name)},</h2>
    <p>Gracias por registrarte en Eventix. Usa el siguiente código para verificar tu cuenta:</p>
    <p style="font-size: 1.3rem; font-weight: 700; margin: 20px 0;">${escapeHtml(
      verificationCode
    )}</p>
    <p>Si no fuiste tú, ignora este mensaje.</p>
  `;
  const text = `Hola ${name},\n\nGracias por registrarte en Eventix. Usa este código para verificar tu cuenta: ${verificationCode}\n\nSi no fuiste tú, ignora este mensaje.`;

  return sendEmail({ to, subject, text, html });
}

async function sendLoginNotification(to, name) {
  const subject = "Inicio de sesión en Eventix";
  const html = `
    <h2>Hola ${escapeHtml(name)},</h2>
    <p>Se ha registrado un inicio de sesión exitoso en tu cuenta Eventix.</p>
    <p>Si no reconoces esta actividad, cambia tu contraseña lo antes posible.</p>
  `;
  const text = `Hola ${name},\n\nSe ha registrado un inicio de sesión exitoso en tu cuenta Eventix. Si no reconoces esta actividad, cambia tu contraseña lo antes posible.`;

  return sendEmail({ to, subject, text, html });
}

async function sendPurchaseConfirmationEmail(to, name, purchase) {
  const eventName = purchase.evento_nombre || "Evento desconocido";
  const eventDate = purchase.evento_fecha || "Fecha no disponible";
  const eventLocation = purchase.evento_lugar || "Lugar no disponible";
  const subject = `Compra confirmada - ${eventName}`;
  const ticketRows = (purchase.tickets || [])
    .map(
      (ticket) => `
        <li>
          ${escapeHtml(ticket.tipo)} - Fila ${escapeHtml(ticket.fila)}, asiento ${escapeHtml(ticket.asiento)}
          - Codigo: ${escapeHtml(ticket.codigo_unico)}
        </li>
      `
    )
    .join("");
  const ticketText = (purchase.tickets || [])
    .map(
      (ticket) =>
        `${ticket.tipo} - Fila ${ticket.fila}, asiento ${ticket.asiento} - Codigo: ${ticket.codigo_unico}`
    )
    .join("\n");
  const html = `
    <h2>Hola ${escapeHtml(name)},</h2>
    <p>Tu compra fue confirmada correctamente.</p>
    <p><strong>Evento:</strong> ${escapeHtml(eventName)}</p>
    <p><strong>Fecha:</strong> ${escapeHtml(eventDate)}</p>
    <p><strong>Lugar:</strong> ${escapeHtml(eventLocation)}</p>
    <p><strong>Total:</strong> RD$ ${Number(purchase.total).toFixed(2)}</p>
    <p><strong>Pago:</strong> ${formatPaymentForEmail(purchase)}</p>
    <h3>Tus boletas</h3>
    <ul>${ticketRows}</ul>
  `;
  const text = `Hola ${name},

Tu compra fue confirmada correctamente.

Evento: ${eventName}
Fecha: ${eventDate}
Lugar: ${eventLocation}
Total: RD$ ${Number(purchase.total).toFixed(2)}
Pago: ${formatPaymentForText(purchase)}

Tus boletas:
${ticketText}`;

  return sendEmail({ to, subject, text, html });
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatPaymentForEmail(purchase) {
  return escapeHtml(formatPaymentForText(purchase));
}

function formatPaymentForText(purchase) {
  if (!purchase.metodo_pago) {
    return "No registrado";
  }

  const last4 = purchase.pago_ultimos4 ? ` terminada en ${purchase.pago_ultimos4}` : "";
  const reference = purchase.referencia_pago ? `, referencia ${purchase.referencia_pago}` : "";

  return `Tarjeta${last4}${reference}`;
}

module.exports = {
  sendVerificationEmail,
  sendLoginNotification,
  sendPurchaseConfirmationEmail,
};
