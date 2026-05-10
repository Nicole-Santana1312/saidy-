const path = require("path");
const fs = require("fs");
const multer = require("multer");

const uploadDir = path.join(__dirname, "..", "..", "public", "uploads", "events");
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const safeName = file.originalname
      .toLowerCase()
      .replace(/[^a-z0-9.]+/g, "-")
      .replace(/-+/g, "-");
    cb(null, `${Date.now()}-${safeName}`);
  },
});

function imageFileFilter(req, file, cb) {
  if (!file.mimetype.startsWith("image/")) {
    return cb(new Error("Solo se permiten archivos de imagen."));
  }

  return cb(null, true);
}

const uploadEventImage = multer({
  storage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 4 * 1024 * 1024,
  },
}).single("imagen_archivo");

function handleEventImageUpload(req, res, next) {
  uploadEventImage(req, res, (error) => {
    if (error) {
      error.status = 400;
      return next(error);
    }

    if (req.file) {
      req.body.imagen = `/uploads/events/${req.file.filename}`;
    }

    if (typeof req.body.ticket_types === "string") {
      try {
        req.body.ticket_types = JSON.parse(req.body.ticket_types);
      } catch (parseError) {
        parseError.status = 400;
        parseError.message = "Los tipos de boletas deben tener formato JSON valido.";
        return next(parseError);
      }
    }

    return next();
  });
}

module.exports = {
  handleEventImageUpload,
};
