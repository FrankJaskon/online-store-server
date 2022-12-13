import { Router } from 'express'
import deviceController from '../controllers/deviceController'
const deviceRouter: any = new ( Router as any )()

deviceRouter.post( '/', deviceController.create )
deviceRouter.get( '/', deviceController.getAll )
deviceRouter.get( '/:id', deviceController.getOne )

export default deviceRouter