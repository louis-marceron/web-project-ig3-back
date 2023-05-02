import { Sequelize } from 'sequelize-typescript'

const db: Sequelize = new Sequelize({
    storage: ':memory:',
    dialect: 'sqlite',
    models: [__dirname + '/../src/models'],
    define: {
        freezeTableName: true,
        timestamps: false,
    },
    logging: false,
});

export default db;