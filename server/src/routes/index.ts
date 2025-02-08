import { Router } from 'express'
import userRouter from './user.route'
import loginRouter from './login.route'

const router = Router()

router.use('/user', userRouter)
router.use('/auth', loginRouter)

export default router
