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
    @Column({ type: DataTypes.UUID, allowNull: false })
    declare user_id: string;

    @PrimaryKey
    @ForeignKey(() => Meal)
    @Column({ type: DataTypes.UUID, allowNull: false })
    declare meal_id: string;

    @Column({ type: DataTypes.DATE, allowNull: false })
    declare consumption_date: Date;

    @BelongsTo(() => AppUser)
    declare user: AppUser;

    @BelongsTo(() => Meal)
    declare meal: Meal;
}
