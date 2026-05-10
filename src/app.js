const express = require("express");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");

const homeRoutes = require("./routes/homeRoutes");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const eventRoutes = require("./routes/eventRoutes");
const ticketTypeRoutes = require("./routes/ticketTypeRoutes");
const saleRoutes = require("./routes/saleRoutes");
const userRoutes = require("./routes/userRoutes");
const reportRoutes = require("./routes/reportRoutes");
const checkinRoutes = require("./routes/checkinRoutes");
const userAuthRoutes = require("./routes/userAuthRoutes");
const userDashboardRoutes = require("./routes/userDashboardRoutes");
const purchaseRoutes = require("./routes/purchaseRoutes");
const { notFound, errorHandler } = require("./middlewares/errorHandler");

const app = express();

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        "default-src": ["'self'"],
        "base-uri": ["'self'"],
        "font-src": ["'self'", "https:", "data:"],
        "form-action": ["'self'"],
        "frame-ancestors": ["'self'"],
        "img-src": ["'self'", "data:", "https://images.unsplash.com"],
        "object-src": ["'none'"],
        "script-src": ["'self'"],
        "script-src-attr": ["'none'"],
        "style-src": ["'self'", "'unsafe-inline'"],
        "upgrade-insecure-requests": [],
      },
    },
  })
);
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false, limit: "6mb" }));
app.use(express.json({ limit: "6mb" }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "..", "public")));
app.use(
  "/vendor/chart.js",
  express.static(path.join(__dirname, "..", "node_modules", "chart.js", "dist"))
);

app.get("/", (req, res) => {
  res.redirect("/home");
});

app.use(homeRoutes);
app.use(authRoutes);
app.use(adminRoutes);
app.use(eventRoutes);
app.use(ticketTypeRoutes);
app.use(saleRoutes);
app.use(userRoutes);
app.use(reportRoutes);
app.use(checkinRoutes);
app.use(userAuthRoutes);
app.use(userDashboardRoutes);
app.use(purchaseRoutes);
app.use(notFound);
app.use(errorHandler);

module.exports = app;
