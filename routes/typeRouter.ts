import { Router } from 'express'
import typeController from '../controllers/typeController'
const typeRouter: any = new ( Router as any )()

typeRouter.post( '/', typeController.create )
typeRouter.get( '/', typeController.getAll )

export default typeRouter