const userSearchForm = document.querySelector("[data-user-search-form]");
const usersTableBody = document.querySelector("[data-users-table-body]");
const userDetail = document.querySelector("[data-user-detail]");
const userMessage = document.querySelector("[data-user-message]");

async function loadUsers(search = "") {
  const params = new URLSearchParams();

  if (search) {
    params.set("q", search);
  }

  const url = params.toString() ? `/api/usuarios?${params}` : "/api/usuarios";
  const response = await fetch(url, {
    headers: { Accept: "application/json" },
  });
  const data = await response.json();

  renderUsers(data.users || []);
}

function renderUsers(users) {
  if (users.length === 0) {
    usersTableBody.innerHTML = `
      <tr>
        <td colspan="5" class="empty-table">No se encontraron usuarios.</td>
      </tr>
    `;
    return;
  }

  usersTableBody.innerHTML = users.map(renderUserRow).join("");
}

function renderUserRow(user) {
  return `
    <tr>
      <td><strong>${escapeHtml(user.nombre)}</strong></td>
      <td>${escapeHtml(user.email)}</td>
      <td>${escapeHtml(user.telefono || "Sin telefono")}</td>
      <td>${formatDate(user.creado_en)}</td>
      <td>
        <div class="table-actions">
          <button type="button" class="compact-button" data-user-detail-id="${user.id}">Ver detalle</button>
          <button type="button" class="compact-button danger" data-user-delete-id="${user.id}">Eliminar</button>
        </div>
      </td>
    </tr>
  `;
}

async function handleSearch(event) {
  event.preventDefault();
  const search = new FormData(userSearchForm).get("q").trim();
  await loadUsers(search);
}

async function handleTableClick(event) {
  const detailId = event.target.dataset.userDetailId;
  const deleteId = event.target.dataset.userDeleteId;

  if (detailId) {
    await showUserDetail(detailId);
  }

  if (deleteId) {
    await removeUser(deleteId);
  }
}

async function showUserDetail(id) {
  const response = await fetch(`/api/usuarios/${id}`, {
    headers: { Accept: "application/json" },
  });
  const data = await response.json();

  if (!response.ok) {
    showMessage(data.message, true);
    return;
  }

  userDetail.innerHTML = `
    <p class="eyebrow">Detalle</p>
    <h2>${escapeHtml(data.user.nombre)}</h2>
    <dl class="detail-list">
      <div>
        <dt>Email</dt>
        <dd>${escapeHtml(data.user.email)}</dd>
      </div>
      <div>
        <dt>Telefono</dt>
        <dd>${escapeHtml(data.user.telefono || "Sin telefono")}</dd>
      </div>
      <div>
        <dt>Fecha de registro</dt>
        <dd>${formatDate(data.user.creado_en)}</dd>
      </div>
    </dl>
  `;
}

async function removeUser(id) {
  const shouldDelete = window.confirm("Seguro que deseas eliminar este usuario?");

  if (!shouldDelete) {
    return;
  }

  const response = await fetch(`/api/usuarios/${id}`, {
    method: "DELETE",
    headers: { Accept: "application/json" },
  });
  const data = await response.json();

  showMessage(data.message, !response.ok);

  if (response.ok) {
    userDetail.innerHTML = `
      <p class="eyebrow">Detalle</p>
      <h2>Selecciona un usuario</h2>
      <p>Haz clic en Ver detalle para consultar la informacion registrada.</p>
    `;
    await loadUsers(new FormData(userSearchForm).get("q").trim());
  }
}

function showMessage(message, isError) {
  userMessage.hidden = false;
  userMessage.textContent = message;
  userMessage.classList.toggle("error", isError);
}

function formatDate(value) {
  return new Intl.DateTimeFormat("es-DO", {
    dateStyle: "medium",
  }).format(new Date(value.replace(" ", "T")));
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

userSearchForm.addEventListener("submit", handleSearch);
usersTableBody.addEventListener("click", handleTableClick);
loadUsers();
