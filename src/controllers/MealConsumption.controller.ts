import { Request, Response, NextFunction } from "express";
import { z, ZodError } from 'zod';
import MealConsumption from '../models/MealConsumption.model';
import MealConsumptionSchema from '../validators/MealConsumption.validator';
import { ForeignKeyConstraintError, Sequelize } from "sequelize";

export const getAllMealConsumptions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const mealConsumptions = await MealConsumption.findAll({ where: { user_id: req.params.id } })

    if (mealConsumptions.length === 0) {
      return res.status(404).json({ error: 'No meal consumptions found for this user' })
    }

    return res.status(200).json(mealConsumptions)
  }

  catch (error) {
    console.error('Error fetching meal consumptions:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export const getMealConsumption = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const mealConsumption = await MealConsumption.findOne({ where: { user_id: req.params.id, consumption_date: req.params.timestamp } })

    if (!mealConsumption) {
      return res.status(404).json({ error: 'Meal consumption not found' })
    }

    return res.status(200).json(mealConsumption)
  }

  catch (error) {
    console.error('Error fetching meal consumption:', error);
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export const createMealConsumption = async (req: Request, res: Response) => {
  try {
    const mealConsumptionInput = MealConsumptionSchema.parse(req.body)
    const newMealConsumption = await MealConsumption.create({ ...mealConsumptionInput, user_id: req.params.id })
    return res.status(201).json(newMealConsumption)
  }

  catch (error) {
    if (error instanceof ZodError)
      return res.status(400).json({ error: 'Validation error', details: error.errors })

    if (error instanceof ForeignKeyConstraintError)
      return res.status(422).json({ error: 'Foreign key constraint error' })

    console.error('Error creating meal consumption:', error)
    return res.status(500).json({ error: 'Error creating meal consumption' })
  }
}

export const deleteMealConsumption = async (req: Request, res: Response) => {
  try {
    const mealConsumption = await MealConsumption.findOne({ where: { user_id: req.params.id, consumption_date: req.params.timestamp } })

    if (!mealConsumption) {
      return res.status(404).json('Meal consumption not found')
    }

    await mealConsumption.destroy()
    return res.status(204).json('Meal consumption deleted')
  }

  catch (error) {
    console.error('Error deleting meal consumption', error)
    return res.status(500).json('Error deleting meal consumption')
  }
}
