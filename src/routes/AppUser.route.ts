import { Router } from 'express'
import * as Controller from '../controllers/AppUser.controller'

export default Router()
    .get('/', Controller.getAllUsers)
    .get('/:id', Controller.getUserById)
    .post('/', Controller.createUser)
    .patch('/:id', Controller.updateUser)
    .delete('/:id', Controller.deleteUser)
    .post('/signup', Controller.signup)
    .post('/login', Controller.login)
