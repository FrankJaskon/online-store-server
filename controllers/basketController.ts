import { NextFunction, Request, Response } from 'express'
import ApiError, { SMTH_WENT_WRONG } from '../error/ApiError'
import { Basket, BasketDevice, Device } from '../models/models'

const findAndCountAllDevices = async ( basketId: number ) => {
	const basketDevices: any = await BasketDevice.findAll({ where: { basketId }})
	const devicesId = []
	for ( let i = 0; i < basketDevices.length; i++ ) {
		devicesId.push( basketDevices[ i ].deviceId )
	}
	const devices = await Device.findAndCountAll({ where: { id: devicesId }})
	return devices
}

class basketController {
	async create( req: any, res: Response, next: NextFunction ) {
		const { deviceId } = req.body
		let { id: userId } = req.user
		userId = Number( userId )

		const basket: any = await Basket.findOne({ where: { userId }})
		const basketDevice: any = await BasketDevice.create({ basketId: basket.id, deviceId })
		// const device: any = await Device.update({ basketDeviceId: basketDevice.id }, { where: { id: deviceId }})

		const devices = await findAndCountAllDevices( basket.id )

		return res.json({ devices })
	}
	async update( req: any, res: Response, next: NextFunction ) {
		// const { deviceId } = req.body
		// let { id: userId } = req.user
		// userId = Number( userId )

		// const basket: any = await Basket.findOne({ where: { userId }})
		// const basketDevice = await BasketDevice.increment( 'count', { by: 1, where: { id: deviceId }})

		// const devices = await findAndCountAllDevices( basket.id )

		// return res.json({ devices })
	}
	async getAll( req: any, res: Response, next: NextFunction ) {
		const { id } = req?.user
		if ( !id ) {
			return next( ApiError.badRequest( SMTH_WENT_WRONG ))
		}
		const basket: any = await Basket.findOne({ where: { userId: id }})
		const devices = await findAndCountAllDevices( basket.id )
		return res.json({ devices })
	}
}

export default new basketController()