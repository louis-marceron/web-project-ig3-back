import { Sequelize } from 'sequelize-typescript'

if (!process.env.DATABASE_URL) {
    throw new Error('Missing DATABASE_URL environment variable.')
}

const url: string = process.env.DATABASE_URL as string
const splitUrl: string[] = url.split(/[:@/]/);

const sequelize = new Sequelize({
    database: splitUrl[7],
    dialect: 'postgres',
    username: splitUrl[3],
    password: splitUrl[4],
    models: [__dirname + '/../models'],
    define: {
        freezeTableName: true,
        timestamps: false,
    },
    logging: false,
  });

export default sequelize
