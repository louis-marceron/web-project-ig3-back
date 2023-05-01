import { Sequelize } from 'sequelize-typescript'

export default new Sequelize({
    storage: ':memory:',
    dialect: 'sqlite',
    models: [__dirname + '/../src/models'],
    define: {
        freezeTableName: true,
        timestamps: false,
    },
    logging: false,
});
