const jwt = require("jsonwebtoken");
/**
 * Middleware d'authentification JWT.
 * Vérifie la présence et la validité du token Bearer dans le header Authorization.
 *
 * @function authMiddleware
 * @param {Object} req - Objet requête Express.
 * @param {Object} req.headers.authorization - Header Authorization contenant le token.
 * @param {Object} res - Objet réponse Express.
 * @param {Function} next - Fonction pour passer au middleware suivant.
 *
 * @returns {void}
 * @throws Renvoie 401 si token manquant.
 * @throws Renvoie 403 si token invalide.
 *
 * @sideeffect Ajoute à `req` les propriétés `user`, `userId` et `userRole` décodées du token.
 */
module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token manquant" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  } catch (err) {
    res.status(403).json({ message: "Token invalide" });
  }
};
