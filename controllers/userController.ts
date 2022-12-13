import { NextFunction, Request, Response } from 'express'
import ApiError from '../error/ApiError'

class userController {
	async registration( req: Request, res: Response ) {

	}
	async login( req: Request, res: Response ) {

	}
	async check( req: Request, res: Response, next: NextFunction ) {
		const { id } = req.query
		if ( !id ) {
			return next( ApiError.badRequest( 'User with this ID has not been found' ) )
		}
		res.json( id )
	}
}

export default new userController()