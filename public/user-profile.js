// User Profile Page - Edición de perfil
const profileForm = document.getElementById("profile-form");
const profileMessage = document.getElementById("profile-message");
const nombreInput = document.getElementById("nombre");
const emailInput = document.getElementById("email");
const telefonoInput = document.getElementById("telefono");

async function loadProfile() {
  try {
    const response = await fetch("/api/user/perfil", {
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      if (response.status === 401) {
        window.location.href = "/user/login";
        return;
      }
      throw new Error("Error al cargar perfil");
    }

    const data = await response.json();

    nombreInput.value = data.user.nombre || "";
    emailInput.value = data.user.email || "";
    telefonoInput.value = data.user.telefono || "";
  } catch (error) {
    showMessage(`Error: ${error.message}`, true);
  }
}

profileForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  try {
    const payload = {
      nombre: nombreInput.value.trim(),
      email: emailInput.value.trim(),
      telefono: telefonoInput.value.trim(),
    };

    const response = await fetch("/api/user/perfil", {
      method: "PUT",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      if (response.status === 401) {
        window.location.href = "/user/login";
        return;
      }
      const error = await response.json();
      throw new Error(error.message || "Error al actualizar perfil");
    }

    const data = await response.json();
    showMessage(data.message || "Perfil actualizado correctamente.", false);
  } catch (error) {
    showMessage(`Error: ${error.message}`, true);
  }
});

function showMessage(message, isError) {
  profileMessage.textContent = message;
  profileMessage.className = isError ? "error" : "success";
  profileMessage.removeAttribute("hidden");

  setTimeout(() => {
    profileMessage.setAttribute("hidden", "");
  }, 5000);
}

loadProfile();
