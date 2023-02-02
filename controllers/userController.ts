import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import ApiError, { INCORRECT_DATA, SMTH_WENT_WRONG } from '../error/ApiError'
import userService from '../service/user-service'
import { validationResult } from 'express-validator'

const generateJwt = ( id: number, email: string, role: string ) => {
	const payload = new Object({ id, email, role })
	return jwt.sign( payload, process.env.JWT_ACCESS_SECRET as jwt.Secret, { expiresIn: '4h' })
}

const saveRefreshTokenInCookie = ( res: Response, token: string ) => {
	res.cookie( 'refreshToken', token, {
		maxAge: 30 * 24 * 60 * 60 *1000,
		httpOnly: true,
		path: '/',
		sameSite: 'none',
		secure: true
	})
}

class userController {
	async registration( req: Request, res: Response, next: NextFunction ) {
		try {
			const errors = validationResult( req )
			if ( !errors.isEmpty() ) {
				return next( ApiError.badRequest( 'Validation error', errors.array() ))
			}
			const { email, password } = req.body

			const userData = await userService.registration( email, password )
			saveRefreshTokenInCookie( res, userData.refreshToken )

			return res.json( userData )
		} catch( e ) {
			next( e )
		}

	}
	async activate( req: Request, res: Response, next: NextFunction ) {
		try {
			const activationLink = req.params.link

			await userService.activate( activationLink )
			return res.redirect( process.env.CLIENT_URL as string )
		} catch( e ) {
			next( e )
		}

	}
	async login( req: Request, res: Response, next: NextFunction ) {
		try {
			const { email, password } = req.body

			const userData = await userService.login( email, password )
			saveRefreshTokenInCookie( res, userData.refreshToken )
			return res.json( userData )
		} catch( e ) {
			next( e )
		}
	}
	async refresh( req: Request, res: Response, next: NextFunction ) {
		try {
			const { refreshToken } = req.cookies
			const userData = await userService.refresh( refreshToken )
			saveRefreshTokenInCookie( res, userData.refreshToken )
			return res.json( userData )
		} catch( e ) {
			next( e )
		}
	}
	async logout( req: Request, res: Response, next: NextFunction ) {
		try {
			const { refreshToken } = req.cookies
			const { status } = await userService.logout( refreshToken )
			if ( Number( status ) !== 200 ) {
				return res.json({ status: 404 })
			}
			res.clearCookie( 'refreshToken' )
			return res.json({ status })
		} catch( e ) {
			next( e )
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