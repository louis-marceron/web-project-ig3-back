const express = require('express');
const helmet = require('helmet');

const notFoundErrorHandler = require('./middlewares/error-handlers/notFoundErrorHandler');
const genericErrorHandler = require('./middlewares/error-handlers/genericErrorHandler');

const app = express();

app.use(helmet());
// Exlication du fonction de .json() et .urlencoded() : https://stackoverflow.com/a/51844327
app.use(express.json()); // Transforme les requêtes entrantes JSON en objet JS 
app.use(express.urlencoded({ extended: true })); // Permet de lire les données des strings dans les requêtes entrantes 

// Middlewares personnalisés
// app.use(customMiddleware);

// Routes

// Middlewares de gestion des erreurs
app.use(notFoundErrorHandler);
app.use(genericErrorHandler);

// Exporte le module app pour l'utiliser dans d'autres fichiers (index.js)
module.exports = app;
