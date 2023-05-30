import { Router } from 'express'
import * as UserController from '../controllers/AppUser.controller'

export default Router()
    .post('/signup', UserController.signup)
    .post('/login', UserController.login)
    .post('/logout', UserController.logout)
