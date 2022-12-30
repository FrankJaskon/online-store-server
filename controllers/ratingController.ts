import { NextFunction, Request, Response } from 'express'
import ApiError from '../error/ApiError'
import { Device, Rating } from '../models/models'

const getAverageGrade = ( arr: [] ) => {
	let average = 0;
	arr.forEach(( item: any ) => {
		average += item?.grade
	})
	return average = Math.round( average / ( arr.length ) )
}

class ratingController {
	async create( req: Request, res: Response, next: NextFunction ) {
		const { userId, deviceId, grade } = req.body
		if ( !deviceId || !userId ) {
			return next( ApiError.badRequest( 'Something went wrong' ))
		}
		const userRating: any = await Rating.findOne({ where: { userId, deviceId } })
		if ( userRating ) {
			return next( ApiError.badRequest( 'You have already left your grade' ))
		}
		if ( grade < 0 || grade > 10 ) {
			return next( ApiError.badRequest( 'Rating is out of range' ))
		}
		const rating = await Rating.create({ userId, deviceId, grade })
		const allRatings: any = await Rating.findAll({ where: { deviceId }})

		const newRating = getAverageGrade( allRatings )

		const device = await Device.update({ rating: newRating }, { where: { id: deviceId } })

		return res.json({ rating, newRating })
	}
	// async getAll( req: Request, res: Response, next: NextFunction ) {
	// 	const { deviceId } = req.query
	// 	if ( !deviceId ) {
	// 		return next( ApiError.badRequest( 'Device has not been chosen' ))
	// 	}
    //     const rating: any = await Rating.findAll({ where: { deviceId }})

    //     return res.json({ rating })
	// }
	async getOne( req: Request, res: Response ) {
		const { userId, deviceId } = req.query
        const grade = await Rating.findOne({ where: { userId, deviceId }})
        return res.json({ grade })
	}
}

export default new ratingController()