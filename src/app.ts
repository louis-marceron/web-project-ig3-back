const helmet = require('helmet')
import express from 'express'
import cookieParser from 'cookie-parser'
import notFoundErrorHandler from './middlewares/notFoundErrorHandler'
import userRoutes from './routes/AppUser.route'
import mealRoutes from './routes/Meal.route'

// Hack for ts-node-dev to work (sometimes it doesn't load the express.d.ts file)
import AppUser from './models/AppUser.model'
declare global {
    namespace Express {
        interface Request {
            user: AppUser
        }
    }
}

/** Middleware for handling HTTP requests. */
const app = express()

app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use("/users", userRoutes)
app.use("/meals", mealRoutes)

app.use(notFoundErrorHandler)

export default app
