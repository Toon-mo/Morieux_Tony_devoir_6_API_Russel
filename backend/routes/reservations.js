const reservationController = require("../controllers/reservationControllers");
const checkJWT = require("../middlewares/checkJWT");
const express = require("express");
const router = express.Router();

/**
 * Route GET /
 * Récupère toutes les réservations.
 * Protection : authentification JWT requise.
 *
 * @name GET /
 * @function
 * @memberof module:Routes/Reservations
 * @param {Object} req - Requête Express (authentifiée).
 * @param {Object} res - Réponse Express avec liste des réservations.
 */
router.get("/", checkJWT, reservationController.getAll);

// Route pour les réservations en cours uniquement
router.get("/current", checkJWT, reservationController.getCurrentReservations);

/**
 * Route POST /
 * Crée une nouvelle réservation.
 * Protection : authentification JWT requise.
 *
 * @name POST /
 * @function
 * @memberof module:Routes/Reservations
 * @param {Object} req.body - Données de réservation.
 * @param {number|string} req.body.catwayNumber - Numéro du catway réservé.
 * @param {string} req.body.startDate - Date de début (format ISO).
 * @param {string} req.body.endDate - Date de fin (format ISO).
 * @param {Object} res - Réponse Express avec réservation créée.
 */
router.post("/", checkJWT, reservationController.create);

/**
 * Route PUT /:id
 * Modifie une réservation existante.
 * Protection : authentification JWT requise.
 *
 * @name PUT /:id
 * @function
 * @memberof module:Routes/Reservations
 * @param {string} req.params.id - ID de la réservation à modifier.
 * @param {Object} req.body - Données à modifier.
 * @param {Object} res - Réponse Express avec réservation modifiée.
 */
router.put("/:id", checkJWT, reservationController.update);

/**
 * Route DELETE /:id
 * Supprime une réservation.
 * Protection : authentification JWT requise.
 *
 * @name DELETE /:id
 * @function
 * @memberof module:Routes/Reservations
 * @param {string} req.params.id - ID de la réservation à supprimer.
 * @param {Object} res - Réponse Express confirmant la suppression.
 */
router.delete("/:id", checkJWT, reservationController.delete);

module.exports = router;
