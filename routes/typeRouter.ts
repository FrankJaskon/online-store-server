import { Router } from 'express'
import typeController from '../controllers/typeController'
import CheckRoleMiddleware from '../middleware/CheckRoleMiddleware'
const typeRouter: any = new ( Router as any )()

typeRouter.post( '/', CheckRoleMiddleware( 'ADMIN' ), typeController.create )
typeRouter.get( '/', typeController.getAll )

export default typeRouter