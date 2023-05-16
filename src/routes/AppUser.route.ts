import { Router } from 'express'
import * as Controller from '../controllers/AppUser.controller'
import isAdmin from '../middlewares/isAdmin.middleware'

export default Router()
    .get('/', isAdmin, Controller.getAllUsers)
    .get('/:id', isAdmin, Controller.getUserById)
    .post('/', isAdmin, Controller.createUser)
    .patch('/:id', isAdmin, Controller.updateUser)
    .delete('/:id', isAdmin, Controller.deleteUser)
    .post('/signup', Controller.signup)
    .post('/login', Controller.login)
