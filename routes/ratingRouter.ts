import { Router } from 'express'
import ratingController from '../controllers/ratingController'
import AuthMiddleware from '../middleware/AuthMiddleware'
const ratingRouter: any = new ( Router as any )()

ratingRouter.post( '/', AuthMiddleware, ratingController.create )
ratingRouter.get( '/', ratingController.getOne )

export default ratingRouter