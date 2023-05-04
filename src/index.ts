import loadDevEnv from './config/loadDevEnv'
import loadDatabase from './config/loadDatabase'
import app from './app'

loadDevEnv()
loadDatabase()

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server is running: http://localhost:${PORT}`))
