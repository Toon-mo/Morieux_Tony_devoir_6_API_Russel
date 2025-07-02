const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const checkJWT = require("../middlewares/checkJWT");
/**
 * Route POST /login
 * Authentifie un utilisateur avec email et mot de passe.
 *
 * @name POST /login
 * @function
 * @memberof module:Routes/Auth
 * @param {Object} req.body - Données de connexion.
 * @param {string} req.body.email - Email de l'utilisateur.
 * @param {string} req.body.password - Mot de passe en clair.
 * @returns {JSON} Token JWT si succès, message d'erreur sinon.
 */
router.post("/login", authController.login);
/**
 * Route POST /register
 * Crée un nouvel utilisateur.
 *
 * @name POST /register
 * @function
 * @memberof module:Routes/Auth
 * @param {Object} req.body - Données d'inscription.
 * @param {string} req.body.name - Nom de l'utilisateur.
 * @param {string} [req.body.firstname] - Prénom optionnel.
 * @param {string} req.body.email - Email unique.
 * @param {string} req.body.password - Mot de passe.
 * @param {string} [req.body.role] - Rôle (optionnel).
 * @returns {JSON} Message de succès ou d'erreur.
 */
router.post("/register", authController.register);
/**
 * Route GET /me
 * Récupère les informations de l'utilisateur connecté.
 * Middleware `checkJWT` protège cette route.
 *
 * @name GET /me
 * @function
 * @memberof module:Routes/Auth
 * @param {Object} req.user - Données utilisateur extraites du JWT.
 * @returns {JSON} Objet utilisateur sans mot de passe.
 */

router.get("/me", checkJWT, authController.me);

module.exports = router;
