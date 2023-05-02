const helmet = require('helmet');
import express from 'express'

import notFoundErrorHandler from './middlewares/notFoundErrorHandler'

import userController from "./controllers/AppUser.controller"

const app = express();

app.use(helmet());
app.use(express.json()); // Transforme les requêtes entrantes JSON en objet JS 
app.use(express.urlencoded({ extended: true })); // Permet de lire les données des strings dans les requêtes entrantes 

// Routes
app.use("/users", userController)

// Middlewares de gestion des erreurs
app.use(notFoundErrorHandler);

// Exporte le module app pour l'utiliser dans d'autres fichiers (index.js)
export default app;
