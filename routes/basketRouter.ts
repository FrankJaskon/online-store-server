import { Router } from 'express'
import basketController from '../controllers/basketController'
import AuthMiddleware from '../middleware/AuthMiddleware'
const basketRouter: any = new ( Router as any )()

basketRouter.post( '/', AuthMiddleware, basketController.create )
basketRouter.put( '/', AuthMiddleware, basketController.update )
basketRouter.get( '/', AuthMiddleware, basketController.getAll )

export default basketRouter