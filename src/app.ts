const helmet = require('helmet')
import express from 'express'
import notFoundErrorHandler from './middlewares/notFoundErrorHandler'
import userRoutes from './routes/AppUser.route'

/** Middleware for handling HTTP requests. */
const app = express()

app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/users", userRoutes)

app.use(notFoundErrorHandler)

export default app
