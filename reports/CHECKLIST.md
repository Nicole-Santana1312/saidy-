# Evidencias y checklist Eventix

## Evidencias a generar

- Capturas Playwright: `test-results/`
- Reporte Playwright HTML: `playwright-report/`
- Reporte Lighthouse: `reports/lighthouse/`

## Comandos

```bash
npm.cmd run dev
npm.cmd run test:e2e
npm.cmd run lighthouse
```

## Checklist profesional

- Estructura controllers/routes/middlewares/services.
- Variables seguras en `.env` y `.env.example`.
- Rate limit con `express-rate-limit`.
- Subida de imagenes con `multer`.
- Admin por defecto configurable con variables de entorno.
- Esquema SQL con claves foraneas en `database/schema.sql`.
- Coleccion Postman en `postman/Eventix.postman_collection.json`.
- Pruebas Playwright en `tests/e2e`.
- Lighthouse configurado por script.
- Reportes con Chart.js.
