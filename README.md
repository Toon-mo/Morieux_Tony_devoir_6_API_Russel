# API Port de Plaisance Russell

API Express + MongoDB privée pour la gestion des réservations de catways au Port de Plaisance Russell.

---

## Fonctionnalités

- Authentification via JWT
- CRUD Catways
- CRUD Réservations
- Interface frontend simple (HTML/JS)
- Documentation API
- Données initiales injectables via script

---

## Prérequis

- Node.js / Express.js
- MongoDB / Mongoose
- JWT / Bcrypt
- HTML/CSS + Bootstrap (frontend simple)

---

## Installation

### 1. Cloner le projet

```bash
git clone https://github.com/tony-morieux/port-russell-api.git
cd port-russell-api/backend
```

### 2. Installer les dépendances

npm install

### 3. Configurer l'environnement .env

Créer un fichier .env à la racine du dossier backend avec ces variables

```
PORT=8080
MONGO_URI = mongodb:"ici votre identifiant MongoDB"
JWT_SECRET=votreclejwt
```

### 4. Injecter les données (y compris le compte test)

Assurez-vous que MongoDB est en cours d'exécution :

node backend/seed.js

### 5. Lancer le serveur

npm run dev

### 6. Lancer le frontend

http://localhost:5500/

### 7. Connexion sur l'API

```
Email: admin@port.fr
Password : admin1234
```
