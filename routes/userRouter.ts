import { Router } from 'express'
import AuthMiddleware from '../middleware/AuthMiddleware'
import userController from '../controllers/userController'
const userRouter: any = new ( Router as any )()

userRouter.post( '/registration', userController.registration )
userRouter.post( '/login', userController.login )
userRouter.get( '/auth', AuthMiddleware, userController.check )

export default userRouter