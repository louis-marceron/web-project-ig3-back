const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    define: {
        freezeTableName: true,
        timestamps: false,
    },
    logging: false,
});

module.exports = sequelize;
