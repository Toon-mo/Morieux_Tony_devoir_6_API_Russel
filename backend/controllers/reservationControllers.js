const Reservation = require("../models/reservation.model");
const Catway = require("../models/catway.model");

/**
 * Récupère toutes les réservations.
 *
 * @async
 * @function getAll
 * @param {Object} req - Objet requête Express.
 * @param {Object} res - Objet réponse Express.
 *
 * @returns {JSON[]} Liste des réservations.
 * @returns {JSON} Message d'erreur 500 en cas d'erreur serveur.
 */
exports.getAll = async (req, res) => {
  try {
    const reservations = await Reservation.find();
    res.json(reservations);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Erreur serveur lors de la récupération des réservations",
    });
  }
};

/**
 * Récupère les réservations en cours (dont la date actuelle est entre startDate et endDate).
 *
 * @async
 * @function getCurrentReservations
 * @param {Object} req - Objet requête Express.
 * @param {Object} res - Objet réponse Express.
 *
 * @returns {JSON[]} Liste des réservations en cours.
 * @returns {JSON} Message d'erreur 500 en cas d'erreur serveur.
 */
exports.getCurrentReservations = async (req, res) => {
  try {
    const now = new Date();
    const currentReservations = await Reservation.find({
      startDate: { $lte: now },
      endDate: { $gte: now },
    });
    res.json(currentReservations);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message:
        "Erreur serveur lors de la récupération des réservations en cours",
    });
  }
};

/**
 * Crée une nouvelle réservation.
 * Vérifie que le catway est en bon état et disponible sur les dates demandées.
 *
 * @async
 * @function create
 * @param {Object} req - Objet requête Express.
 * @param {Object} req.body - Corps de la requête.
 * @param {number|string} req.body.catwayNumber - Numéro du catway réservé.
 * @param {string} req.body.startDate - Date de début de réservation (format ISO).
 * @param {string} req.body.endDate - Date de fin de réservation (format ISO).
 * @param {Object} res - Objet réponse Express.
 *
 * @returns {JSON} Objet réservation créée (201).
 * @returns {JSON} Message d'erreur 400 si catway indisponible ou dates en conflit.
 * @returns {JSON} Message d'erreur 400 en cas de données invalides.
 */
exports.create = async (req, res) => {
  try {
    const { catwayNumber, startDate, endDate } = req.body;

    // Vérifier que le catway existe et est en bon état
    const catway = await Catway.findOne({
      catwayNumber: Number(catwayNumber),
      catwayState: "bon état",
    });
    if (!catway) {
      return res.status(400).json({
        message:
          "Le catway choisi n'est pas disponible car il n'est pas en bon état.",
      });
    }

    // Vérifier qu'il n'y a pas de réservation qui chevauche les dates
    const chevauchement = await Reservation.findOne({
      catwayNumber: Number(catwayNumber),
      $or: [
        {
          startDate: { $lte: new Date(endDate) },
          endDate: { $gte: new Date(startDate) },
        },
      ],
    });
    if (chevauchement) {
      return res.status(400).json({
        message: "Le catway est déjà réservé sur ces dates.",
      });
    }

    const newReservation = new Reservation(req.body);
    const savedReservation = await newReservation.save();
    res.status(201).json(savedReservation);
  } catch (error) {
    console.error(error);
    res.status(400).json({
      message: "Erreur lors de la création de la réservation",
      error: error.message,
    });
  }
};

/**
 * Met à jour une réservation existante.
 * Vérifie que le catway est en bon état et disponible sur les nouvelles dates demandées,
 * en excluant la réservation modifiée du contrôle de conflit.
 *
 * @async
 * @function update
 * @param {Object} req - Objet requête Express.
 * @param {string} req.params.id - ID de la réservation à modifier.
 * @param {Object} req.body - Données à mettre à jour.
 * @param {number|string} req.body.catwayNumber - Nouveau numéro du catway réservé.
 * @param {string} req.body.startDate - Nouvelle date de début (format ISO).
 * @param {string} req.body.endDate - Nouvelle date de fin (format ISO).
 * @param {Object} res - Objet réponse Express.
 *
 * @returns {JSON} Objet réservation mise à jour.
 * @returns {JSON} Message d'erreur 400 si catway indisponible ou conflit de dates.
 * @returns {JSON} Message d'erreur 404 si réservation non trouvée.
 */
exports.update = async (req, res) => {
  try {
    const { catwayNumber, startDate, endDate } = req.body;

    // Vérifier que le catway existe et est en bon état
    const catway = await Catway.findOne({
      catwayNumber: Number(catwayNumber),
      catwayState: "bon état",
    });
    if (!catway) {
      return res.status(400).json({
        message:
          "Le catway choisi n'est pas disponible car il n'est pas en bon état.",
      });
    }

    // Vérifier qu'il n'y a pas de réservation qui chevauche les dates, en excluant la réservation actuelle
    const chevauchement = await Reservation.findOne({
      _id: { $ne: req.params.id },
      catwayNumber: Number(catwayNumber),
      $or: [
        {
          startDate: { $lte: new Date(endDate) },
          endDate: { $gte: new Date(startDate) },
        },
      ],
    });
    if (chevauchement) {
      return res.status(400).json({
        message: "Le catway est déjà réservé sur ces dates.",
      });
    }

    const updatedReservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedReservation) {
      return res.status(404).json({ message: "Réservation non trouvée" });
    }
    res.json(updatedReservation);
  } catch (error) {
    console.error(error);
    res.status(400).json({
      message: "Erreur lors de la mise à jour de la réservation",
      error: error.message,
    });
  }
};

/**
 * Supprime une réservation.
 *
 * @async
 * @function delete
 * @param {Object} req - Objet requête Express.
 * @param {string} req.params.id - ID de la réservation à supprimer.
 * @param {Object} res - Objet réponse Express.
 *
 * @returns {JSON} Message de confirmation de suppression.
 * @returns {JSON} Message d'erreur 404 si réservation non trouvée.
 * @returns {JSON} Message d'erreur 500 en cas d'erreur serveur.
 */
exports.delete = async (req, res) => {
  try {
    const deletedReservation = await Reservation.findByIdAndDelete(
      req.params.id
    );
    if (!deletedReservation) {
      return res.status(404).json({ message: "Réservation non trouvée" });
    }
    res.json({ message: "Réservation supprimée" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Erreur serveur lors de la suppression de la réservation",
      error: error.message,
    });
  }
};
