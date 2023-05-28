/**
 * Loads environment variables from a .env file into process.env.
 * @throws {Error} if the dotenv package is missing.
 * @throws {Error} if the .env file is missing.
 */
export default function loadEnvironmentVariables(): void {
  const dotenv = require('dotenv')
  const result = dotenv.config()
  if (result.error) {
    throw new Error('Failed to load environment variables. You must create a .env file in the root directory of the project.')
  }
}
