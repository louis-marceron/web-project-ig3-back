import {
    Table,
    Column,
    Model,
    PrimaryKey,
} from "sequelize-typescript";
import { DataTypes } from "sequelize";

@Table({ tableName: "meal" })
export default class Meal extends Model {
    @PrimaryKey
    @Column({ type: DataTypes.INTEGER, autoIncrement: true ,allowNull: false })
    declare meal_id: number;

    @Column({ type: DataTypes.STRING, allowNull: false })
    declare name: string;

    @Column({ type: DataTypes.STRING, allowNull: true })
    declare description: string;

    @Column({ type: DataTypes.STRING, allowNull: false })
    declare image_url: string;

    @Column({ type: DataTypes.INTEGER, allowNull: false })
    declare carbon_footprint: number;
}
