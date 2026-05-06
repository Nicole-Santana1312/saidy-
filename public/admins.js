const adminForm = document.querySelector("[data-admin-form]");
const adminsTableBody = document.querySelector("[data-admins-table-body]");
const adminMessage = document.querySelector("[data-admin-message]");

async function loadAdmins() {
  try {
    const response = await fetch("/api/admins", {
      headers: { Accept: "application/json" },
    });
    const data = await readJsonResponse(response);

    if (!response.ok) {
      throw new Error(data.message || "No se pudieron cargar los administradores.");
    }

    renderAdmins(data.admins || []);
  } catch (error) {
    showMessage(`Error: ${error.message}`, true);
  }
}

function renderAdmins(admins) {
  if (admins.length === 0) {
    adminsTableBody.innerHTML = `
      <tr>
        <td colspan="4" class="empty-table">No hay administradores registrados.</td>
      </tr>
    `;
    return;
  }

  adminsTableBody.innerHTML = admins.map(renderAdminRow).join("");
}

function renderAdminRow(admin) {
  return `
    <tr>
      <td><strong>${escapeHtml(admin.email)}</strong></td>
      <td>${admin.role === "super_admin" ? "Admin principal" : "Administrador"}</td>
      <td>${formatDate(admin.creado_en)}</td>
      <td>
        <button type="button" class="compact-button danger" data-admin-delete-id="${admin.id}">
          Eliminar
        </button>
      </td>
    </tr>
  `;
}

async function handleSubmit(event) {
  event.preventDefault();
  const submitButton = adminForm.querySelector("button[type='submit']");
  submitButton.disabled = true;
  submitButton.textContent = "Creando...";

  try {
    const formData = new FormData(adminForm);
    const payload = {
      email: formData.get("email").trim(),
      password: formData.get("password"),
      role: formData.get("role"),
    };

    const response = await fetch("/api/admins", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await readJsonResponse(response);

    showMessage(data.errors ? data.errors.join(" ") : data.message, !response.ok);

    if (response.ok) {
      adminForm.reset();
      await loadAdmins();
    }
  } catch (error) {
    showMessage(`Error: ${error.message}`, true);
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Crear administrador";
  }
}

async function handleTableClick(event) {
  const deleteId = event.target.dataset.adminDeleteId;

  if (!deleteId) {
    return;
  }

  const shouldDelete = window.confirm("Seguro que deseas eliminar este administrador?");

  if (!shouldDelete) {
    return;
  }

  try {
    const response = await fetch(`/api/admins/${deleteId}`, {
      method: "DELETE",
      headers: { Accept: "application/json" },
    });
    const data = await readJsonResponse(response);

    showMessage(data.message, !response.ok);

    if (response.ok) {
      await loadAdmins();
    }
  } catch (error) {
    showMessage(`Error: ${error.message}`, true);
  }
}

function showMessage(message, isError) {
  adminMessage.hidden = false;
  adminMessage.textContent = message || "Ocurrio un error inesperado.";
  adminMessage.classList.toggle("error", isError);
  adminMessage.scrollIntoView({ behavior: "smooth", block: "center" });
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
    dateStyle: "medium",
  }).format(new Date(value));
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

adminForm.addEventListener("submit", handleSubmit);
adminsTableBody.addEventListener("click", handleTableClick);
loadAdmins();
