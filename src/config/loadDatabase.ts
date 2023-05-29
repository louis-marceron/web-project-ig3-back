import { Sequelize } from 'sequelize-typescript';
import MissingEnvVariableError from '../types/missingEnvVariableError';

/**
 * Initializes and configures the Sequelize instance to connect to the database
 * and sync the models.
 * @throws {Error} When the DATABASE_URL environment variable is not set.
 * @throws {Error} When unable to connect to the database or sync the models.
 */
export default function initializeDatabase(): void {
    if (!process.env.DATABASE_URL)
        throw new MissingEnvVariableError('DATABASE_URL')

    const sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres',
        models: [`${__dirname}/../models`],
        define: {
            freezeTableName: true,
            timestamps: false,
        },
        logging: false,
    });

    sequelize.authenticate()
        .catch(err => {
            console.error('Unable to connect to the database:', err)
            throw err
        })
        .then(() => sequelize.sync({ alter: true }))
        .catch((err => {
            console.error('Unable to sync to the database:', err);
            throw err;
        }))
}
