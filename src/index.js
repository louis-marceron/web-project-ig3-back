if (process.env.NODE_ENV !== 'production') {
    const result = require('dotenv').config();
    if (result.error) {
        throw new Error('Failed to load environment variables. You must create a .env file in the root directory of the project.');
    }
}

if (!process.env.DATABASE_URL) {
    throw new Error('Missing DATABASE_URL environment variable.');
}

const app = require('./app');
const sequelize = require('./config/database');
const PORT = process.env.PORT || 3000;

// Load models
require('./models/Book');

(async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        console.log('Database connection established and models synced.');

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Unable to connect to the database or sync models:', error);
    }
})();
