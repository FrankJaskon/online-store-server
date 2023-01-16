import { Router } from 'express'
import basketController from '../controllers/basketController'
import AuthMiddleware from '../middleware/AuthMiddleware'
import CheckRoleMiddleware from '../middleware/CheckRoleMiddleware'
const basketRouter: any = new ( Router as any )()

basketRouter.post( '/', CheckRoleMiddleware( 'ADMIN' ), basketController.create )
basketRouter.patch( '/', CheckRoleMiddleware( 'ADMIN' ), basketController.update )
basketRouter.delete( '/', CheckRoleMiddleware( 'ADMIN' ), basketController.delete )
basketRouter.get( '/', AuthMiddleware, basketController.getAll )

export default basketRouter