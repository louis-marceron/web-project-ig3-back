import { Router } from 'express'
import * as MealController from '../controllers/Meal.controller'


export default Router()
    .get('/', MealController.getAllUsers)