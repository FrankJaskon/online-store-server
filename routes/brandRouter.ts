import { Router } from 'express'
import brandController from '../controllers/brandController'
const brandRouter: any = new ( Router as any )()

brandRouter.post( '/', brandController.create )
brandRouter.get( '/', brandController.getAll )

export default brandRouter