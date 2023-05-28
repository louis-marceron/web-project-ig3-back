import { Router } from 'express'
import * as Controller from '../controllers/AppUser.controller'
import isAdmin from '../middlewares/isAdmin.middleware'
import authenticateToken from '../middlewares/authenticateToken.middleware'

export default Router()
    .get('/', authenticateToken, isAdmin, Controller.getAllUsers)
    .get('/:id', authenticateToken, isAdmin, Controller.getUserById)
    .post('/', authenticateToken, isAdmin, Controller.createUser)
    .patch('/:id', authenticateToken, isAdmin, Controller.updateUser)
    .delete('/:id', authenticateToken, isAdmin, Controller.deleteUser)
    .post('/signup', Controller.signup)
    .post('/login', Controller.login)
    .post('/logout', authenticateToken, Controller.logout)
