const express = require("express");
const router = express.Router();
const User = require("../models/user.model");
const checkJWT = require("../middlewares/checkJWT");
/**
 * Route POST /register
 * Crée un nouvel utilisateur.
 * Accessible sans authentification (inscription).
 *
 * @name POST /register
 * @function
 * @memberof module:Routes/User
 * @param {Object} req.body - Données utilisateur.
 * @param {string} req.body.name - Nom (requis).
 * @param {string} [req.body.firstname] - Prénom (optionnel).
 * @param {string} req.body.email - Email unique (requis).
 * @param {string} req.body.password - Mot de passe (requis).
 * @returns {JSON} Message de succès ou d’erreur.
 */
router.post("/register", async (req, res) => {
  try {
    const { name, firstname, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Nom, email et mot de passe requis." });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: "Email déjà utilisé" });
    }

    const newUser = new User({ name, firstname, email, password });
    await newUser.save();

    res.status(201).json({ message: "Utilisateur créé avec succès" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

/**
 * Route GET /
 * Récupère la liste de tous les utilisateurs sans les mots de passe.
 * Protection : authentification JWT
 *
 * @name GET /
 * @function
 * @memberof module:Routes/User
 * @param {Object} req - Requête Express authentifiée.
 * @param {Object} res - Réponse Express avec tableau d’utilisateurs.
 */
router.get("/", checkJWT, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

/**
 * Route PUT /:id
 * Met à jour un utilisateur par son ID.
 * Protection : authentification JWT
 *
 * @name PUT /:id
 * @function
 * @memberof module:Routes/User
 * @param {string} req.params.id - ID de l’utilisateur à modifier.
 * @param {Object} req.body - Données à mettre à jour.
 * @param {Object} res - Réponse Express avec utilisateur mis à jour.
 * @returns {JSON} Message d’erreur 404 si utilisateur non trouvé.
 */
router.put("/:id", checkJWT, async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.json(updatedUser);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Erreur de mise à jour", error: err.message });
  }
});

/**
 * Route DELETE /:id
 * Supprime un utilisateur par son ID.
 * Protection : authentification JWT
 *
 * @name DELETE /:id
 * @function
 * @memberof module:Routes/User
 * @param {string} req.params.id - ID de l’utilisateur à supprimer.
 * @param {Object} res - Réponse Express confirmant la suppression.
 * @returns {JSON} Message d’erreur 404 si utilisateur non trouvé.
 */
router.delete("/:id", checkJWT, async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.json({ message: "Utilisateur supprimé" });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;
