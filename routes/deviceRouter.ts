import { Router } from 'express'
import deviceController from '../controllers/deviceController'
import CheckRoleMiddleware from '../middleware/CheckRoleMiddleware'
const deviceRouter: any = new ( Router as any )()

deviceRouter.post( '/', CheckRoleMiddleware( 'ADMIN' ), deviceController.create )
deviceRouter.get( '/', deviceController.getAll )
deviceRouter.delete( '/', CheckRoleMiddleware( 'ADMIN' ), deviceController.remove )
deviceRouter.get( '/:id', deviceController.getOne )
deviceRouter.put( '/:id', CheckRoleMiddleware( 'ADMIN' ), deviceController.update )

export default deviceRouter