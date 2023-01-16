import { NextFunction, Request, Response } from 'express'
import ApiError, { SMTH_WENT_WRONG } from '../error/ApiError'
import { Basket, BasketDevice, Device } from '../models/models'

const findAndCountAllDevices = async ( basketId: number ) => {
	const basketDevices: any = await BasketDevice.findAll({ where: { basketId }})
	const devicesId = []
	for ( let i = 0; i < basketDevices.length; i++ ) {
		devicesId.push( basketDevices[ i ].deviceId )
	}
	const devices: any = await Device.findAndCountAll({ where: { id: devicesId }})

	return { devices, basketDevices }
}

class basketController {
	async create( req: any, res: Response, next: NextFunction ) {
		let { deviceId } = req.body
		let { id: userId } = req.user
		deviceId = Number( deviceId )
		userId = Number( userId )

		const basket: any = await Basket.findOne({ where: { userId }})
		const basketDevice: any = await BasketDevice.create({ basketId: basket.id, deviceId })

		return res.json({ basketDevice })
	}
	async update( req: any, res: Response, next: NextFunction ) {
		let { deviceId, increment, decrement } = req.body
		let { id: userId } = req.user
		deviceId = Number( deviceId )
		userId = Number( userId )

		const device: any = await BasketDevice.findOne({ where: { deviceId }})

		if ( decrement && device.count === 1 ) {
			await BasketDevice.destroy({ where: { deviceId }})
			return res.json({ removed: true, message: 'Item has been removed' })
		}

		if ( increment ) {
			await BasketDevice.increment( 'count', { by: 1, where: { deviceId }})
		} else if ( decrement ) {
			await BasketDevice.decrement( 'count', { by: 1, where: { deviceId }})
		} else {
			return next( ApiError.badRequest( SMTH_WENT_WRONG ))
		}

		const basketDevice = await BasketDevice.findOne({ where: { deviceId }})

		return res.json({ basketDevice })
	}
	async delete( req: any, res: Response, next: NextFunction ) {
		let { deviceId } = req.body
		let { id: userId } = req.user
		deviceId = Number( deviceId )
		userId = Number( userId )

		await BasketDevice.destroy({ where: { deviceId }})

		return res.json({ removed: true, message: 'Item has been removed' })
	}
	async getAll( req: any, res: Response, next: NextFunction ) {
		const { id } = req?.user
		if ( !id ) {
			return next( ApiError.badRequest( SMTH_WENT_WRONG ))
		}
		const basket: any = await Basket.findOne({ where: { userId: id }})
		const devices = await findAndCountAllDevices( basket.id )
		return res.json( devices )
	}
}

export default new basketController()