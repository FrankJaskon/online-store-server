import { NextFunction, Request, Response } from 'express'
import ApiError from '../error/ApiError'
import { Type } from '../models/models'

class typeController {
	async create( req: Request, res: Response, next: NextFunction ) {
		try {
			const { name } = req.body
			const type = await Type.findOne({ where: { name } })
			if ( type ) {
				return next( ApiError.badRequest( 'Type with this name already exists' ))
			}
			const newType = await Type.create({ name })
			return res.json({ newType })
		} catch( e ) {
			next( ApiError.badRequest(( e as Error ).message ))
		}
	}
	async getAll( req: Request, res: Response, next: NextFunction ) {
		try {
			const types = await Type.findAll()
			return res.json({ types })
		} catch( e ) {
			next( ApiError.badRequest(( e as Error ).message ))
		}
	}
}

export default new typeController()