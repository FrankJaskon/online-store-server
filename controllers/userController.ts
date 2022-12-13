import { NextFunction, Request, Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import ApiError from '../error/ApiError'
import { User, Basket } from '../models/models'

const generateJwt = ( id: number, email: string, role: string ) => {
	return jwt.sign({ id, email, role }, process.env.SECRET_KEY as jwt.Secret, { expiresIn: '4h' })
}

const INCORRECT_DATA: 'Email or password is incorrect' = 'Email or password is incorrect'

class userController {
	async registration( req: Request, res: Response, next: NextFunction ) {
		const { email, password, role } = req.body
		if ( !email || !password ) {
			return next( ApiError.badRequest( INCORRECT_DATA ))
		}
		const candidate = await User.findOne({ where: { email } })
		if ( candidate ) {
			return next( ApiError.badRequest( 'User with this Email already exists' ))
		}
		const hasPassword = await bcrypt.hash( password, 5 )
		const user: any = await User.create({ email, role, password: hasPassword })
		const basket = await Basket.create({ userId: user.id })
		const token = generateJwt( user.id, user.email, user.role )

		return res.json({ token })
	}
	async login( req: Request, res: Response, next: NextFunction ) {
		const { email, password } = req.body
		const user: any = await User.findOne({ where: { email } })
		if ( !user ) {
			return next( ApiError.internal( INCORRECT_DATA ) )
		}
		const comparePassword = bcrypt.compare( password, user.password )
		if ( !comparePassword ) {
			return next( ApiError.internal( INCORRECT_DATA ) )
		}
		const token = generateJwt( user.id, user.email, user.role )
		return res.json({ token })
	}
	async check( req: any, res: Response, next: NextFunction ) {
		const token = generateJwt( req.id, req.email, req.role )
		return res.json({ token })
	}
}

export default new userController()