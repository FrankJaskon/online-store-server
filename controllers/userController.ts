import { Request, Response } from 'express'

class userController {
	async registration( req: Request, res: Response ) {

	}
	async login( req: Request, res: Response ) {

	}
	async check( req: Request, res: Response ) {
		const { id } = req.query
		res.json( id )
	}
}

export default new userController()