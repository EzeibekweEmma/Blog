import express from 'express'

const routes = express.Router()

routes.get('/', (req, res) => {
  res.send('user route')
})

export default routes
