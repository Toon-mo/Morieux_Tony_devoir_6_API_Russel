const express = require("express");
const router = express.Router();
const checkJWT = require("../middlewares/checkJWT");
const catwaysController = require("../controllers/catwayControllers");

/**
 * Route GET /
 * Récupère tous les catways.
 * Protection : authentification JWT
 *
 * @name GET /
 * @function
 * @memberof module:Routes/Catways
 * @param {Object} req - Requête Express (authentifiée).
 * @param {Object} res - Réponse Express avec liste des catways.
 */
router.get("/", checkJWT, catwaysController.getAll);

/**
 * Route POST /
 * Crée un nouveau catway.
 * Protection : authentification JWT
 *
 * @name POST /
 * @function
 * @memberof module:Routes/Catways
 * @param {Object} req.body - Données du catway à créer.
 * @param {number} req.body.catwayNumber - Numéro unique du catway.
 * @param {string} req.body.catwayType - Type du catway ("short" ou "long").
 * @param {Object} res - Réponse Express avec catway créé.
 */
router.post("/", checkJWT, catwaysController.create);

/**
 * Route PUT /:id
 * Modifie un catway existant.
 * Protection : authentification JWT
 *
 * @name PUT /:id
 * @function
 * @memberof module:Routes/Catways
 * @param {string} req.params.id - ID du catway à modifier.
 * @param {Object} req.body - Données à modifier.
 * @param {Object} res - Réponse Express avec catway modifié.
 */
router.put("/:id", checkJWT, catwaysController.update);

/**
 * Route DELETE /:id
 * Supprime un catway.
 * Protection : authentification JWT
 *
 * @name DELETE /:id
 * @function
 * @memberof module:Routes/Catways
 * @param {string} req.params.id - ID du catway à supprimer.
 * @param {Object} res - Réponse Express confirmant la suppression.
 */
router.delete("/:id", checkJWT, catwaysController.delete);

module.exports = router;
