/**
 * Point d'entrée du serveur backend.
 *
 * - Charge les variables d'environnement depuis .env.
 * - Établit la connexion à la base de données MongoDB.
 * - Démarre le serveur Express sur le port configuré.
 *
 * @module server
 */
const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: path.resolve(__dirname, ".env") });

const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 8080;

(async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Serveur en écoute sur http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Erreur lors de la connexion à la base de données :", error);
    process.exit(1);
  }
})();
