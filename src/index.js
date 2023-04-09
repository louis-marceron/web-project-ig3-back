// Empêche le programme de crasher en production, car il n'y pas dotenv
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const app = require('./app'); 
const sequelize = require('./config/database');
const PORT = process.env.PORT || 3000;

// Charge les modelels de la base de données pour que Sequelize puisse les synchroniser
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
