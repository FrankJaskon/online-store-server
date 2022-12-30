import { NextFunction, Request, Response } from 'express'
import ApiError from '../error/ApiError'
import { Brand } from '../models/models'

class brandController {
	async create( req: Request, res: Response, next: NextFunction ) {
		const { name } = req.body
		const brand = await Brand.findOne({ where: { name } })
		if ( brand ) {
			return next( ApiError.badRequest( 'Brand with such name already exists' ))
		}
		const newBrand = await Brand.create({ name })
		return res.json({ newBrand })
	}
	async getAll( req: Request, res: Response ) {
		const brands = await Brand.findAll()
		return res.json({ brands })
	}
}

export default new brandController()