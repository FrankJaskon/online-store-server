import { Router } from 'express'
import userRouter from './userRouter'
import deviceRouter from './deviceRouter'
import brandRouter from './brandRouter'
import typeRouter from './typeRouter'

const router: any = new ( Router as any )()

router.use( '/user', userRouter )
router.use( '/type', typeRouter )
router.use( '/brand', brandRouter )
router.use( '/device', deviceRouter )

export default router