import { NextFunction, Request, Response } from 'express'
import ApiError, { SMTH_WENT_WRONG } from '../error/ApiError'
import { Device, Rating } from '../models/models'

const getAverageGrade = ( arr: [] ) => {
	let average = 0
	arr.forEach(( item: any ) => {
		average += item.grade
	})
	average = average / ( arr.length )
	average = String( '' + average ).includes( '.' ) ? Number( average.toFixed( 1 )) : average
	console.log( average )
	return average
}

class ratingController {
	async create( req: any, res: Response, next: NextFunction ) {
		let { deviceId, grade } = req.body
		let { id: userId } = req.user
		deviceId = Number( deviceId )
		grade = Number( grade )
		userId = Number( userId )
		if ( !deviceId || !userId || !grade ) {
			return next( ApiError.badRequest( SMTH_WENT_WRONG ))
		}
		if ( grade < 0 || grade > 10 ) {
			return next( ApiError.badRequest( 'Rating is out of range' ))
		}
		const userRating: any = await Rating.findOne({ where: { userId, deviceId }})
		if ( userRating ) {
			const rating = await Rating.update({ grade }, { where: { userId, deviceId }})
			const allRatings: any = await Rating.findAll({ where: { deviceId }})

			const newRating = getAverageGrade( allRatings )

			const device = await Device.update({ rating: newRating }, { where: { id: deviceId } })
			return res.json({ newRating })
		}
		const rating = await Rating.create({ userId, deviceId, grade })
		const allRatings: any = await Rating.findAll({ where: { deviceId }})

		const newRating = getAverageGrade( allRatings )

		const device = await Device.update({ rating: newRating }, { where: { id: deviceId } })

		return res.json({ newRating })
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