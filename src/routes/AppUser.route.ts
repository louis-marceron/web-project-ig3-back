import { Router } from 'express'
import * as UserController from '../controllers/AppUser.controller'
import * as MealConsumptionController from '../controllers/MealConsumption.controller'
import isAdmin from '../middlewares/isAdmin.middleware'
import authenticateToken from '../middlewares/authenticateToken.middleware'
import userIdMatchUrlOrAdmin from '../middlewares/userIdMatchOrAdmin.middleware'

export default Router()
    // User's information
    .get('/', authenticateToken, isAdmin, UserController.getAllUsers)
    .get('/:id', authenticateToken, userIdMatchUrlOrAdmin, UserController.getUserById)
    .post('/', authenticateToken, isAdmin, UserController.createUser)
    .patch('/:id', authenticateToken, userIdMatchUrlOrAdmin, UserController.updateUser)
    .delete('/:id', authenticateToken, userIdMatchUrlOrAdmin, UserController.deleteUser)
    // Authentication
    .post('/signup', UserController.signup)
    .post('/login', UserController.login)
    .post('/logout', authenticateToken, UserController.logout)
    // User's meals consumption
    .get('/api/users/:id/meal-consumptions', authenticateToken, userIdMatchUrlOrAdmin, MealConsumptionController.getAllMealConsumptions)
    .get('/api/users/:id/meal-consumptions/:timestamp', authenticateToken, userIdMatchUrlOrAdmin, MealConsumptionController.getMealConsumption)
    .post('/api/users/:id/meal-consumptions', authenticateToken, userIdMatchUrlOrAdmin, MealConsumptionController.createMealConsumption)
    .delete('/api/users/:id/meal-consumptions/:timestamp', authenticateToken, userIdMatchUrlOrAdmin, MealConsumptionController.deleteMealConsumption)
