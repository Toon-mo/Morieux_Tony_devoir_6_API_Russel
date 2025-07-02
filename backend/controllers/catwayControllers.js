const Catway = require("../models/catway.model");

/**
 * Récupère tous les catways.
 *
 * @async
 * @function getAll
 * @param {Object} req - Objet requête Express.
 * @param {Object} res - Objet réponse Express.
 *
 * @returns {JSON[]} Liste des catways.
 * @returns {JSON} Message d'erreur 500 en cas d'erreur serveur.
 */
exports.getAll = async (req, res) => {
  try {
    const catways = await Catway.find();
    res.json(catways);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/**
 * Crée un nouveau catway avec un numéro unique.
 *
 * @async
 * @function create
 * @param {Object} req - Objet requête Express.
 * @param {Object} req.body - Corps de la requête.
 * @param {string} req.body.catwayNumber - Numéro unique du catway.
 * @param {string} req.body.catwayType - Type du catway.
 * @param {Object} res - Objet réponse Express.
 *
 * @returns {JSON} Objet catway créé (201).
 * @returns {JSON} Message d'erreur 400 si numéro déjà utilisé ou données invalides.
 */
exports.create = async (req, res) => {
  try {
    // Vérifier si catwayNumber existe déjà
    const exists = await Catway.findOne({
      catwayNumber: req.body.catwayNumber,
    });
    if (exists) {
      return res
        .status(400)
        .json({ message: "Ce numéro de catway est déjà attribué." });
    }

    // Forcer l'état à "bon état" à la création
    const newCatway = new Catway({
      catwayNumber: req.body.catwayNumber,
      catwayType: req.body.catwayType,
      catwayState: "bon état",
    });
    const savedCatway = await newCatway.save();
    res.status(201).json(savedCatway);
  } catch (err) {
    res.status(400).json({ message: "Données invalides", error: err.message });
  }
};

/**
 * Met à jour un catway existant.
 * Vérifie que le `catwayNumber` reste unique.
 *
 * @async
 * @function update
 * @param {Object} req - Objet requête Express.
 * @param {string} req.params.id - ID du catway à modifier.
 * @param {Object} req.body - Données à mettre à jour.
 * @param {string} [req.body.catwayNumber] - Nouveau numéro de catway (optionnel).
 * @param {Object} res - Objet réponse Express.
 *
 * @returns {JSON} Objet catway mis à jour.
 * @returns {JSON} Message d'erreur 400 si numéro déjà utilisé ou données invalides.
 * @returns {JSON} Message d'erreur 404 si catway non trouvé.
 */
exports.update = async (req, res) => {
  try {
    const { catwayNumber } = req.body;

    if (catwayNumber) {
      // Vérifier si un autre catway utilise déjà ce numéro
      const existingCatway = await Catway.findOne({ catwayNumber });
      if (existingCatway && existingCatway._id.toString() !== req.params.id) {
        return res
          .status(400)
          .json({ message: "Ce numéro de catway est déjà attribué." });
      }
    }

    const updatedCatway = await Catway.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedCatway)
      return res.status(404).json({ message: "Catway non trouvé" });

    res.json(updatedCatway);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Erreur lors de la mise à jour", error: err.message });
  }
};

/**
 * Supprime un catway existant.
 *
 * @async
 * @function delete
 * @param {Object} req - Objet requête Express.
 * @param {string} req.params.id - ID du catway à supprimer.
 * @param {Object} res - Objet réponse Express.
 *
 * @returns {JSON} Message de confirmation de suppression.
 * @returns {JSON} Message d'erreur 404 si catway non trouvé.
 * @returns {JSON} Message d'erreur 500 en cas d'erreur serveur.
 */
exports.delete = async (req, res) => {
  try {
    const deletedCatway = await Catway.findByIdAndDelete(req.params.id);
    if (!deletedCatway)
      return res.status(404).json({ message: "Catway non trouvé" });
    res.json({ message: "Catway supprimé" });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};
