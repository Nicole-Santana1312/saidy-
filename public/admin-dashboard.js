const dashboard = document.querySelector("[data-dashboard]");
const menuButton = document.querySelector("[data-menu-toggle]");
const sidebar = document.querySelector("#sidebar");
const navLinks = document.querySelectorAll(".nav-link");
const counters = document.querySelectorAll("[data-count]");

function toggleMenu() {
  const isOpen = dashboard.classList.toggle("sidebar-open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
}

function closeMenu() {
  dashboard.classList.remove("sidebar-open");
  menuButton.setAttribute("aria-expanded", "false");
}

function animateCounter(counter) {
  const target = Number(counter.dataset.count || 0);
  const duration = 900;
  const startTime = performance.now();

  function update(currentTime) {
    const progress = Math.min((currentTime - startTime) / duration, 1);
    const value = Math.floor(target * easeOut(progress));
    counter.textContent = value.toLocaleString("es-DO");

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

function easeOut(value) {
  return 1 - Math.pow(1 - value, 3);
}

menuButton.addEventListener("click", toggleMenu);

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.forEach((item) => item.classList.remove("active"));
    link.classList.add("active");
    closeMenu();
  });
});

document.addEventListener("click", (event) => {
  if (!dashboard.classList.contains("sidebar-open")) {
    return;
  }

  if (!sidebar.contains(event.target) && !menuButton.contains(event.target)) {
    closeMenu();
  }
});

counters.forEach(animateCounter);
