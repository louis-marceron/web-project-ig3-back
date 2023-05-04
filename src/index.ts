import loadDevEnv from './config/loadDevEnv'
import loadDatabase from './config/loadDatabase'
import app from './app'

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server is running: localhost.${PORT}`))

loadDevEnv()
loadDatabase()
