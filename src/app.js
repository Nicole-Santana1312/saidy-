const express = require("express");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const eventRoutes = require("./routes/eventRoutes");
const ticketTypeRoutes = require("./routes/ticketTypeRoutes");
const saleRoutes = require("./routes/saleRoutes");
const userRoutes = require("./routes/userRoutes");
const reportRoutes = require("./routes/reportRoutes");
const { notFound, errorHandler } = require("./middlewares/errorHandler");

const app = express();

app.use(helmet());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false, limit: "20kb" }));
app.use(express.json({ limit: "20kb" }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "..", "public")));

app.get("/", (req, res) => {
  res.redirect("/login");
});

app.use(authRoutes);
app.use(adminRoutes);
app.use(eventRoutes);
app.use(ticketTypeRoutes);
app.use(saleRoutes);
app.use(userRoutes);
app.use(reportRoutes);
app.use(notFound);
app.use(errorHandler);

module.exports = app;
