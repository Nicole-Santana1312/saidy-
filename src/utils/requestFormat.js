function wantsHtml(req) {
  const accept = req.get("accept") || "";

  if (req.path.startsWith("/api/")) {
    return false;
  }

  // Los formularios del navegador se envian como URL encoded y deben redirigir.
  if (req.is("application/x-www-form-urlencoded")) {
    return true;
  }

  // Solo respondemos JSON cuando la peticion realmente llega como API JSON.
  return !(req.is("application/json") && accept.includes("application/json"));
}

module.exports = {
  wantsHtml,
};
