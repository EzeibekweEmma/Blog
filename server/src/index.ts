import express, { Express, Request, Response } from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import bodyParser from 'body-parser'
import Router from './routes'
import ServerStatus from './routes/server-status.route'

dotenv.config()

const app: Express = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(
  bodyParser.json({
    limit: '50mb',
  })
)
app.use((req, res, next) => {
  const excludedMethods = ['POST', 'PUT', 'PATCH']

  if (!excludedMethods.includes(req.method)) {
    res.setTimeout(20000, () => {
      res.status(408).json({ error: 'Request timed out' })
    })
    next()
  } else {
    next()
  }
})

app.use(ServerStatus)
app.use('/api', Router)

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`)
})
