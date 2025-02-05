import { getServerStatus } from '@/services'
import express from 'express'

const router = express.Router()

router.get('/', (req, res) => {
  const { data, status } = getServerStatus()
  res.status(status).json(data)
})

export default router
