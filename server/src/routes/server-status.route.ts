import { getServerStatusService } from '@/services'
import express from 'express'

const router = express.Router()

router.get('/', getServerStatusService)

export default router
