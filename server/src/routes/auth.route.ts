import { loginService, logoutService } from '@/services'
import express from 'express'

const router = express.Router()

router.post('/login', loginService)
router.post('/logout', logoutService)

export default router
