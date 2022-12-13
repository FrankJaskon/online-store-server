import { Router } from 'express'
import deviceController from '../controllers/deviceController'
import CheckRoleMiddleware from '../middleware/CheckRoleMiddleware'
const deviceRouter: any = new ( Router as any )()

deviceRouter.post( '/', CheckRoleMiddleware( 'ADMIN' ), deviceController.create )
deviceRouter.get( '/', deviceController.getAll )
deviceRouter.get( '/:id', deviceController.getOne )

export default deviceRouter