import { Router } from 'express'
import * as UserController from '../controllers/AppUser.controller'
import authenticateToken from '../middlewares/authenticateToken.middleware'

export default Router()
    .post('/signup', UserController.signup)
    .post('/login', UserController.login)
    .post('/logout', authenticateToken, UserController.logout)
