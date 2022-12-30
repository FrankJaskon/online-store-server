import { Router } from 'express'
import userRouter from './userRouter'
import deviceRouter from './deviceRouter'
import brandRouter from './brandRouter'
import typeRouter from './typeRouter'
import ratingRouter from './ratingRouter'
import basketRouter from './basketRouter'

const router: any = new ( Router as any )()

router.use( '/user', userRouter )
router.use( '/type', typeRouter )
router.use( '/brand', brandRouter )
router.use( '/device', deviceRouter )
router.use( '/rating', ratingRouter )
router.use( '/basket', basketRouter )

export default router