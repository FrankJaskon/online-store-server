import { Router } from 'express'
import basketController from '../controllers/basketController'
import AuthMiddleware from '../middleware/AuthMiddleware'
import CheckRoleMiddleware from '../middleware/CheckRoleMiddleware'
const basketRouter: any = new ( Router as any )()

basketRouter.post( '/', CheckRoleMiddleware( [ 'USER', 'ADMIN' ] ), basketController.create )
basketRouter.patch( '/', CheckRoleMiddleware( [ 'USER', 'ADMIN' ] ), basketController.update )
basketRouter.delete( '/', CheckRoleMiddleware( [ 'USER', 'ADMIN' ] ), basketController.remove )
basketRouter.get( '/', AuthMiddleware, basketController.getAll )

export default basketRouter