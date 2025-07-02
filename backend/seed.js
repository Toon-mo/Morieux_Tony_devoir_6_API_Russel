/**
 * Script de seed pour initialiser la base de données MongoDB.
 *
 * - Se connecte à MongoDB.
 * - Vide les collections Catway, Reservation et User.
 * - Crée un utilisateur admin avec mot de passe hashé via middleware Mongoose.
 * - Importe les données des fichiers JSON dans les collections.
 *
 * @module seed
 */
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");

const Catway = require("./models/catway.model");
const Reservation = require("./models/reservation.model");
const User = require("./models/user.model");

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Connexion MongoDB établie.");

    // Chargement des données depuis les fichiers JSON
    const catwaysData = JSON.parse(
      fs.readFileSync(path.join(__dirname, "data/catways.json"))
    );
    const reservationsData = JSON.parse(
      fs.readFileSync(path.join(__dirname, "data/reservations.json"))
    );

    // Suppression des anciennes données
    await Catway.deleteMany();
    await Reservation.deleteMany();
    await User.deleteMany();

    // Création de l'utilisateur admin (mot de passe en clair, hashé par middleware)
    const user = await User.create({
      name: "super",
      firstname: "admin",
      email: "admin@port.fr",
      password: "admin1234", // mot de passe en clair
    });

    // Import des catways
    const catways = await Catway.insertMany(catwaysData);

    // Import des réservations, avec conversion des dates en objets Date et lien vers catway
    const reservations = reservationsData.map((r) => {
      const catway = catways.find((c) => c.catwayNumber === r.catwayNumber);
      return {
        catwayNumber: r.catwayNumber,
        clientName: r.clientName,
        boatName: r.boatName,
        startDate: new Date(r.startDate),
        endDate: new Date(r.endDate),
        catway: catway ? catway._id : null,
        utilisateur: user._id,
      };
    });

    await Reservation.insertMany(reservations);

    console.log("Données importées avec succès.");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Erreur lors de l’import :", err);
    process.exit(1);
  });
