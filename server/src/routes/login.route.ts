import { loginService } from '@/services'
import express from 'express'

const router = express.Router()

router.post('/login', loginService)

export default router
