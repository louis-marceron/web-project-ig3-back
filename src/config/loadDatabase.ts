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

    const url: string = process.env.DATABASE_URL;
    const splitUrl: string[] = url.split(/[:@/]/);

    const sequelize = new Sequelize({
        database: splitUrl[7],
        dialect: 'postgres',
        username: splitUrl[3],
        password: splitUrl[4],
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
        .then(() => sequelize.sync())
        .catch((err => {
            console.error('Unable to sync to the database:', err);
            throw err;
        }))
}
