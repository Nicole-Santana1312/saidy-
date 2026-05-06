const { createPurchase } = require("../models/purchaseModel");
const { validateTicket, getTicketByCode } = require("../models/ticketModel");
const { findUserAppById } = require("../models/userAppModel");
const { sendPurchaseConfirmationEmail } = require("../utils/email");

async function makePurchase(req, res, next) {
  try {
    const purchase = await createPurchase(req.user.id, req.body);

    if (!purchase) {
      return res.status(404).json({ message: "Tipo de boleta no encontrado." });
    }

    try {
      const user = await findUserAppById(req.user.id);
      if (user) {
        await sendPurchaseConfirmationEmail(user.email, user.nombre, purchase);
      }
    } catch (emailError) {
      console.error("Purchase confirmation email failed:", emailError.message);
    }

    return res.status(201).json({
      message: "Compra realizada correctamente. Te enviamos la confirmacion por correo.",
      purchase,
    });
  } catch (error) {
    return next(error);
  }
}

async function checkInTicket(req, res, next) {
  try {
    const { codigo_unico } = req.body;

    const result = await validateTicket(codigo_unico);

    return res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    return next(error);
  }
}

async function getTicketInfo(req, res, next) {
  try {
    const ticket = await getTicketByCode(req.params.codigo_unico);

    if (!ticket) {
      return res.status(404).json({ message: "Boleto no encontrado." });
    }

    return res.json({ ticket });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  makePurchase,
  checkInTicket,
  getTicketInfo,
};
