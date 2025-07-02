const mongoose = require("mongoose");
/**
 * Schéma Mongoose pour une réservation de catway.
 *
 * @typedef {Object} Reservation
 * @property {number} catwayNumber - Numéro du catway réservé (minimum 1).
 * @property {string} clientName - Nom du client qui réserve.
 * @property {string} boatName - Nom du bateau réservé.
 * @property {Date} startDate - Date de début de la réservation.
 * @property {Date} endDate - Date de fin de la réservation.
 */
const reservationSchema = new mongoose.Schema({
  catwayNumber: {
    type: Number,
    required: true,
    min: 1,
  },
  clientName: {
    type: String,
    required: true,
  },
  boatName: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("Reservation", reservationSchema);
