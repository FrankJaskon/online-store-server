import { Router } from 'express'
import ratingController from '../controllers/ratingController'
const ratingRouter: any = new ( Router as any )()

ratingRouter.post( '/', ratingController.create )
ratingRouter.get( '/', ratingController.getOne )

export default ratingRouter