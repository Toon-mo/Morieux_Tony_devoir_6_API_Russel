/**
 * Point d'entrée de l'application backend Express.
 * Configure la connexion MongoDB, les middlewares globaux et les routes.
 *
 * @module app
 */
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoutes = require("./routes/users");

dotenv.config();

const authRoutes = require("./routes/auth");
const catwayRoutes = require("./routes/catway.routes");
const reservationRoutes = require("./routes/reservations");

const app = express();

// Middleware pour autoriser les requêtes cross-origin
app.use(cors());

// Middleware pour parser le corps des requêtes en JSON
app.use(express.json());

// Route pour la gestion des utilisateurs
app.use("/api/users", userRoutes);

// Connexion à la base de données MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connecté"))
  .catch((err) => console.error("Erreur MongoDB:", err));

// Déclaration des routes principales de l’API
app.use("/api/auth", authRoutes);
app.use("/api/catways", catwayRoutes);
app.use("/api/reservations", reservationRoutes);

module.exports = app;
