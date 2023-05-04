import dotenv from 'dotenv'

export default (): void => {
    if (process.env.NODE_ENV !== 'production') {
        const result = dotenv.config()
        if (result.error)
            throw new Error('Failed to load environment variables. You must create a .env file in the root directory of the project.');
    }
}
