const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
/**
 * Authentifie un utilisateur avec son email et son mot de passe.
 *
 * @async
 * @function login
 * @param {Object} req - Objet requête Express.
 * @param {Object} req.body - Corps de la requête.
 * @param {string} req.body.email - Email de l'utilisateur.
 * @param {string} req.body.password - Mot de passe en clair.
 * @param {Object} res - Objet réponse Express.
 *
 * @returns {JSON} - JWT token si authentification réussie.
 * @returns {JSON} - Message d'erreur avec code 401 si email ou mot de passe invalides.
 * @returns {JSON} - Message d'erreur 500 en cas d'erreur serveur.
 */
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Email invalide" });

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Mot de passe reçu :", password);
    console.log("Hash en base :", user.password);
    console.log("Résultat bcrypt.compare :", isMatch);

    if (!isMatch)
      return res.status(401).json({ message: "Mot de passe incorrect" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};
/**
 * Inscrit un nouvel utilisateur.
 *
 * @async
 * @function register
 * @param {Object} req - Objet requête Express.
 * @param {Object} req.body - Corps de la requête.
 * @param {string} req.body.name - Nom obligatoire.
 * @param {string} [req.body.firstname] - Prénom optionnel.
 * @param {string} req.body.email - Email obligatoire.
 * @param {string} req.body.password - Mot de passe obligatoire.
 * @param {Object} res - Objet réponse Express.
 *
 * @returns {JSON} - Message de succès 201 si utilisateur créé.
 * @returns {JSON} - Message d'erreur 400 si données manquantes ou email déjà utilisé.
 * @returns {JSON} - Message d'erreur 500 en cas d'erreur serveur.
 */
exports.register = async (req, res) => {
  const { name, firstname, email, password } = req.body;
  try {
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Nom, email et mot de passe sont obligatoires" });
    }

    // Vérifie si l'email existe déjà
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: "Email déjà utilisé" });
    }

    // Hash du mot de passe avant création
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      firstname,
      email: email.toLowerCase(),
      password,
    });

    await newUser.save();

    res.status(201).json({ message: "Utilisateur créé avec succès" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
/**
 * Récupère les informations du profil utilisateur connecté (sans le mot de passe).
 *
 * @async
 * @function me
 * @param {Object} req - Objet requête Express.
 * @param {string} req.userId - ID de l'utilisateur connecté (récupéré via middleware d'auth).
 * @param {Object} res - Objet réponse Express.
 *
 * @returns {JSON} - Objet utilisateur sans mot de passe.
 * @returns {JSON} - Message d'erreur 404 si utilisateur non trouvé.
 * @returns {JSON} - Message d'erreur 500 en cas d'erreur serveur.
 */
exports.me = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user)
      return res.status(404).json({ message: "Utilisateur non trouvé" });

    // Ajouter la date serveur actuelle
    const currentDate = new Date();

    res.json({
      _id: user._id,
      name: user.name,
      firstname: user.firstname,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      serverDate: currentDate,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};
