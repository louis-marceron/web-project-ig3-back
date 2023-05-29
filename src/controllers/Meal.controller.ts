import { NextFunction, Request, Response } from "express"
import Meal from '../models/Meal.model'

export const getAllMeals = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const meals = await Meal.findAll()

        if (meals.length === 0) {
            return res.status(404).json({ error: 'No meals found' })
        }

        return res.status(200).json(meals)
    }

    catch (error) {
        console.error('Error fetching users:', error)
        return res.status(500).json({ error: 'Internal server error' })
    }
}
