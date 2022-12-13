import { Router } from 'express'
import brandController from '../controllers/brandController'
import CheckRoleMiddleware from '../middleware/CheckRoleMiddleware'
const brandRouter: any = new ( Router as any )()

brandRouter.post( '/', CheckRoleMiddleware( 'ADMIN' ), brandController.create )
brandRouter.get( '/', brandController.getAll )

export default brandRouter