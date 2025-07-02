const mongoose = require("mongoose");

/**
 * Établit une connexion à la base de données MongoDB.
 * Utilise la variable d'environnement `MONGO_URI` pour l'URI de connexion.
 * En cas d'erreur, affiche l'erreur dans la console et arrête le processus.
 *
 * @async
 * @function connectDB
 * @returns {Promise<void>} Ne retourne rien, lance une exception en cas d'erreur.
 */
const connectDB = async () => {
  try {
    console.log("URI :", process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Base MongoDB connectée !");
  } catch (err) {
    console.error("Erreur de connexion MongoDB :", err);
    process.exit(); // Arrête le serveur en cas d'erreur
  }
};

module.exports = connectDB;
