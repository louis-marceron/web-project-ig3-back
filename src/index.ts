import dotenv from 'dotenv'

if (process.env.NODE_ENV !== 'production') {
    const result = dotenv.config()
    if (result.error)
        throw new Error('Failed to load environment variables. You must create a .env file in the root directory of the project.');
}

import sequelize from './config/database'
import app from './app'

const PORT = process.env.PORT || 3000

sequelize.authenticate()
    .catch(err => console.error('Unable to connect to the database:', err))
    .then(() => sequelize.sync({ force: true }))
    .catch(err => console.error('Unable to sync the models: ', err))
    .then(() => app.listen(PORT, () => console.log(`Server is running on port ${PORT}`)))
