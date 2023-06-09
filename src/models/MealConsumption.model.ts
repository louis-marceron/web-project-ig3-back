import {
    Table,
    Column,
    Model,
    PrimaryKey,
    ForeignKey,
    BelongsTo,
} from 'sequelize-typescript';
import { DataTypes } from 'sequelize'

import AppUser from './AppUser.model'
import Meal from './Meal.model'

@Table({ tableName: "meal_consumption" })
export default class MealConsumption extends Model {
    @PrimaryKey
    @ForeignKey(() => AppUser)
    @Column({ type: DataTypes.INTEGER, allowNull: false })
    declare user_id: number;

    @PrimaryKey
    @ForeignKey(() => Meal)
    @Column({ type: DataTypes.INTEGER, allowNull: false })
    declare meal_id: number;

    @PrimaryKey
    @Column({ type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW })
    declare consumption_date: Date;

    @BelongsTo(() => AppUser, {
      onDelete: 'CASCADE',
      hooks: true,
    })
    declare user: AppUser;

    @BelongsTo(() => Meal)
    declare meal: Meal;
}
