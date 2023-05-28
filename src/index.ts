import loadEnvironmentVariables from './config/loadEnvironmentVariables'
import loadDatabase from './config/loadDatabase'
import app from './app'

if (process.env.NODE_ENV !== 'production') {
    loadEnvironmentVariables()
}

loadDatabase()

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server is running: http://localhost:${PORT}`))
