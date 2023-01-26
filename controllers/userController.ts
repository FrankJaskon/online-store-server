import { NextFunction, Request, Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import ApiError, { INCORRECT_DATA } from '../error/ApiError'
import { User, Basket } from '../models/models'
import userService from '../service/user-service'

const generateJwt = ( id: number, email: string, role: string ) => {
	const payload = new Object({ id, email, role })
	return jwt.sign( payload, process.env.JWT_ACCESS_SECRET as jwt.Secret, { expiresIn: '4h' })
}

class userController {
	async registration( req: Request, res: Response, next: NextFunction ) {
		try {
			const { email, password } = req.body

			const userData = await userService.registration( email, password )
			res.cookie( 'refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 *1000, httpOnly: true })

			return res.json( userData )
		} catch( e ) {
			next( ApiError.badRequest(( e as Error ).message ))
		}

	}
	async login( req: Request, res: Response, next: NextFunction ) {
		try {
			const { email, password } = req.body
			const user: any = await User.findOne({ where: { email } })
			if ( !user ) {
				return next( ApiError.badRequest( INCORRECT_DATA ) )
			}
			const comparePassword = bcrypt.compare( password, user.password )
			if ( !comparePassword ) {
				return next( ApiError.badRequest( INCORRECT_DATA ) )
			}
			const token = generateJwt( user.id, user.email, user.role )
			return res.json({ token, id: user.id, role: user.role, email: user.email })
		} catch( e ) {
			next( ApiError.badRequest(( e as Error ).message ))
		}
	}
	async logout( req: Request, res: Response, next: NextFunction ) {
		try {

		} catch( e ) {
			next( ApiError.badRequest(( e as Error ).message ))
		}
	}
	async check( req: any, res: Response, next: NextFunction ) {
		try {
			const token = generateJwt( req.user.id, req.user.email, req.user.role )
			return res.json({ token })
		} catch( e ) {
			next( ApiError.badRequest(( e as Error ).message ))
		}
	}
}

export default new userController()

// class userController {
// 	async registration( req: Request, res: Response, next: NextFunction ) {
// 		try {
// 			const { email, password } = req.body
// 			if ( !email || !password ) {
// 				return next( ApiError.badRequest( INCORRECT_DATA ))
// 			}
// 			const candidate = await User.findOne({ where: { email } })
// 			if ( candidate ) {
// 				return next( ApiError.badRequest( 'User with this Email already exists' ))
// 			}
// 			const hasPassword = await bcrypt.hash( password, 5 )
// 			const user: any = await User.create({ email, password: hasPassword })
// 			const basket = await Basket.create({ userId: user.id })
// 			const token = generateJwt( user.id, user.email, user.role )

// 			return res.json({ token })
// 		} catch( e ) {
// 			next( ApiError.badRequest(( e as Error ).message ))
// 		}

// 	}
// 	async login( req: Request, res: Response, next: NextFunction ) {
// 		try {
// 			const { email, password } = req.body
// 			const user: any = await User.findOne({ where: { email } })
// 			if ( !user ) {
// 				return next( ApiError.badRequest( INCORRECT_DATA ) )
// 			}
// 			const comparePassword = bcrypt.compare( password, user.password )
// 			if ( !comparePassword ) {
// 				return next( ApiError.badRequest( INCORRECT_DATA ) )
// 			}
// 			const token = generateJwt( user.id, user.email, user.role )
// 			return res.json({ token, id: user.id, role: user.role, email: user.email })
// 		} catch( e ) {
// 			next( ApiError.badRequest(( e as Error ).message ))
// 		}
// 	}
// 	async logout( req: Request, res: Response, next: NextFunction ) {
// 		try {

// 		} catch( e ) {
// 			next( ApiError.badRequest(( e as Error ).message ))
// 		}
// 	}
// 	async check( req: any, res: Response, next: NextFunction ) {
// 		try {
// 			const token = generateJwt( req.user.id, req.user.email, req.user.role )
// 			return res.json({ token })
// 		} catch( e ) {
// 			next( ApiError.badRequest(( e as Error ).message ))
// 		}
// 	}
// }