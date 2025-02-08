import { config } from 'dotenv'
config()

// this workaround is to allow testing in preview and dev environments
let dbName = process.env.DB_NAME || 'blog'
if (process.env.NODE_ENV === 'test') {
  dbName = `${dbName}_test`
}

const app = {
  environment: process.env.NODE_ENV,
  HOST: process.env.HOST || 'localhost',
  PORT: +(process.env.PORT || 3000),
  FE_BASE_URL: process.env.FE_BASE_URL || 'http://localhost:3000',
  JWT_SECRET: process.env.JWT_SECRET,
  app_name: process.env.APP_NAME,
}

const db = {
  type: 'mongodb' as const,
  url: process.env.MONGODB_URL,
  database: dbName,
}

const validateConfigDetails = (
  configName: string,
  obj: Record<string, any>
): void => {
  const missingFields: string[] = []
  for (const [key, value] of Object.entries(obj)) {
    if (!value) {
      missingFields.push(key)
    }
  }

  if (missingFields.length > 0) {
    throw new Error(
      `Configuration for "${configName}" is incomplete. Missing fields: ${missingFields.join(', ')}`
    )
  }
}

// Validate each configuration
try {
  validateConfigDetails('app', app)
  validateConfigDetails('db', db)
} catch (error) {
  console.error((error as Error).message)
  process.exit(1)
}

export default { app, db }
