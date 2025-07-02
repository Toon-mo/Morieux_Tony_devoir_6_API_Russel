const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
/**
 * Schéma Mongoose pour un utilisateur.
 *
 * @typedef {Object} User
 * @property {string} name - Nom de l'utilisateur (obligatoire).
 * @property {string} [firstname] - Prénom de l'utilisateur (optionnel).
 * @property {string} email - Email unique, obligatoire, stocké en minuscules.
 * @property {string} password - Mot de passe haché.
 * @property {Date} createdAt - Date de création (gérée automatiquement).
 * @property {Date} updatedAt - Date de dernière mise à jour (gérée automatiquement).
 */

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Le Nom est requis"],
    },
    firstname: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      required: [true, "L'email est requis"],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Middleware Mongoose pre-save.
 * Hash le mot de passe si celui-ci est modifié avant de sauvegarder l'utilisateur.
 *
 * @function
 * @param {Function} next - Callback pour passer au middleware suivant.
 */
UserSchema.pre("save", function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = bcrypt.hashSync(this.password, 10);
  next();
});

module.exports = mongoose.model("User", UserSchema);
