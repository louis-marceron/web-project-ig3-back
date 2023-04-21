const helmet = require('helmet');
import express from 'express'

import notFoundErrorHandler from './middlewares/notFoundErrorHandler'
import genericErrorHandler from './middlewares/genericErrorHandler'

const app = express();

app.use(helmet());
// Exlication du fonction de .json() et .urlencoded() : https://stackoverflow.com/a/51844327
app.use(express.json()); // Transforme les requêtes entrantes JSON en objet JS 
app.use(express.urlencoded({ extended: true })); // Permet de lire les données des strings dans les requêtes entrantes 

// Middlewares de gestion des erreurs
app.use(notFoundErrorHandler);
app.use(genericErrorHandler);

// Exporte le module app pour l'utiliser dans d'autres fichiers (index.js)
export default app;
