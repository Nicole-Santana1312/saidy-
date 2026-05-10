const { test, expect } = require("@playwright/test");

test("admin puede iniciar sesion y ver el dashboard", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Email").fill("admin@example.com");
  await page.getByLabel("Contrasena").fill("Admin12345!");
  await page.getByRole("button", { name: "Iniciar sesion" }).click();
  await expect(page).toHaveURL(/\/admin\/dashboard/);
  await expect(page.getByRole("heading", { name: "Dashboard administrativo" })).toBeVisible();
});
