const mongoose = require("mongoose");
/**
 * Schéma Mongoose pour un catway.
 *
 * @typedef {Object} Catway
 * @property {number} catwayNumber - Numéro unique du catway (min 1).
 * @property {string} catwayType - Type de catway, valeur possible : "short" ou "long".
 * @property {string} catwayState - État du catway (ex : "bon état").
 */
const catwaySchema = new mongoose.Schema({
  catwayNumber: {
    type: Number,
    required: true,
    unique: true,
    min: 1,
  },
  catwayType: {
    type: String,
    enum: ["short", "long"],
    required: true,
  },
  catwayState: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Catway", catwaySchema);
