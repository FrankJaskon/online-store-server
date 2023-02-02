import { Router } from 'express'
import AuthMiddleware from '../middleware/AuthMiddleware'
import userController from '../controllers/userController'
import { body } from 'express-validator'

const userRouter: any = new ( Router as any )()

userRouter.post( '/registration',
    body( 'email' ).isEmail(),
    body( 'password' ).isLength({ min: 8, max: 20 }),
    userController.registration )
userRouter.post( '/login', userController.login )
userRouter.post( '/logout', userController.logout )
userRouter.get( '/activate/:link', userController.activate )
userRouter.get( '/refresh', userController.refresh )

export default userRouter