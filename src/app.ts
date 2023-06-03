const helmet = require('helmet')
const cors = require('cors')
import express from 'express'
import cookieParser from 'cookie-parser'
import notFoundErrorHandler from './middlewares/notFoundErrorHandler'
import authenticationRoute from './routes/Authentication.route'
import userRoutes from './routes/AppUser.route'
import mealRoutes from './routes/Meal.route'

/** Middleware for handling HTTP requests. */
const app = express()

// const corsOptions = {
//     origin: ['https://ecodiet-front.cluster-ig3.igpolytech.fr', 'http://localhost:5000', 'https://ecodiet.onrender.com'],
//     credentials: true
// };

// // Apply CORS middleware
// app.use(cors(corsOptions));

app.use(cors({
    origin: ['https://ecodiet-front.cluster-ig3.igpolytech.fr', 'http://localhost:5000', 'https://ecodiet.onrender.com'],
    credentials: true,
}));



//////////////////////// PERMET DE SECURISE L'UTILISATION DE L'API UNIQUEMENT AU SITE
// Définissez la liste des origines autorisées
// const allowedOrigins = ["http://localhost:5000", "https://ecodiet.onrender.com"];

// // Configurez CORS avec une fonction personnalisée pour vérifier l'origine de la requête
// app.use((req, res, next) => {
//     const origin = req.headers.origin;
//     if (allowedOrigins.includes(origin!)) {
//         res.setHeader("Access-Control-Allow-Origin", origin!);
//     } else {
//         // Si l'origine de la requête n'est pas autorisée, renvoyez une erreur ou une réponse appropriée
//         return res.status(403).json({ error: "Access denied" });
//     }
//     next();
// });

// app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use("/auth", authenticationRoute)
app.use("/users", userRoutes)
app.use("/meals", mealRoutes)

app.use(notFoundErrorHandler)

export default app
