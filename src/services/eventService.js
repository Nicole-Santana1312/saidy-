const eventModel = require("../models/eventModel");
const ticketTypeModel = require("../models/ticketTypeModel");

async function listEvents() {
  return eventModel.listEvents();
}

async function findEventById(id) {
  return eventModel.findEventById(id);
}

async function createEventWithTickets(eventData) {
  const ticketTypes = Array.isArray(eventData.ticket_types)
    ? eventData.ticket_types
    : [];

  if (ticketTypes.length === 0) {
    const error = new Error("Debes agregar al menos un tipo de boleta para crear el evento.");
    error.status = 400;
    throw error;
  }

  const event = await eventModel.createEvent(eventData);
  const createdTicketTypes = [];

  try {
    for (const ticketType of ticketTypes) {
      createdTicketTypes.push(
        await ticketTypeModel.createTicketType({
          evento_id: event.id,
          tipo: ticketType.tipo,
          precio: ticketType.precio,
          cantidad_disponible: ticketType.cantidad_disponible,
        })
      );
    }
  } catch (error) {
    await eventModel.deleteEvent(event.id);
    throw error;
  }

  return { event, ticketTypes: createdTicketTypes };
}

async function updateEvent(id, eventData) {
  return eventModel.updateEvent(id, eventData);
}

async function deleteEvent(id) {
  return eventModel.deleteEvent(id);
}

module.exports = {
  createEventWithTickets,
  deleteEvent,
  findEventById,
  listEvents,
  updateEvent,
};
