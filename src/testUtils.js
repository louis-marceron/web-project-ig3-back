const sequelize = require('sequelize');

/**
    Creates a new instance of Sequelize connected to an in-memory SQLite database.
    @async
    @function
    @returns {Promise<sequelize>} A promise that resolves with a Sequelize instance.
    @throws {Error} If there is an error authenticating with the database.
*/
const createDatabaseInstance = async () => {
    const database = new sequelize('sqlite::memory:', {
        define: {
            freezeTableName: true,
            timestamps: false,
        },
        logging: false,
    });
    await database.authenticate();
    return database;
};

module.exports = {
    createDatabaseInstance
}
