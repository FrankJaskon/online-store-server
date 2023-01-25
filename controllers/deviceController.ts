import { NextFunction, Request, Response } from 'express'
import { v4 } from 'uuid'
import path from 'path'
import { Device, DeviceInfo } from '../models/models'
import ApiError from '../error/ApiError'
import { OrderItem } from 'sequelize'

interface InfoField {
    title: string
    description: string
    id: number
}

class deviceController {
	async create( req: Request, res: Response, next: NextFunction ) {
        try {
            const { name, price, brandId, typeId } = req.body
            let { info } = req.body
            const { img }: any = req.files
            const fileName = v4() + ".jpg"
            img.mv( path.resolve( __dirname, '..', 'static', fileName ))

            const device: any = await Device.create( { name, price, brandId, typeId, img: fileName } )

            if ( info ) {
                info = JSON.parse( info )
                info.forEach(( { title, description }: InfoField ) => {
                    DeviceInfo.create({
                        title,
                        description,
                        deviceId: device.id
                    })
                })
            }

            return res.json({ device })
        } catch( e ) {
            next( ApiError.badRequest(( e as Error ).message ))
        }
	}
    async update( req: Request, res: Response, next: NextFunction ) {
        try {
            const { name, price, brandId, typeId } = req.body
            const { id } = req.params
            let { info } = req.body
            const img: any = req.files?.img
            let fileName: string = ''
            let device: any = {}
            if ( img ) {
                fileName = v4() + ".jpg"
                img.mv( path.resolve( __dirname, '..', 'static', fileName ))
                device = await Device.update({ name, price, brandId, typeId, img: fileName }, { where: { id }})
            } else {
                device = await Device.update({ name, price, brandId, typeId }, { where: { id }})
            }

            info = JSON.parse( info )

            if ( info?.length ) {
                let ids: number[] = []
                const infos: any = await DeviceInfo.findAll({ where: { deviceId: id }})
                for ( let i = 0; i < infos.length; i++ ) {
                    ids.push( infos[ i ].id )
                }
                for ( let i = 0; i < info.length; i++ ) {
                    ids = ids.filter( id =>  id !== info[ id ])
                }
                ids.length && await DeviceInfo.destroy({ where: { id: ids }})
                info.forEach( async ({ title, description, id: infoId }: InfoField ) => {
                    const oldInfo = await DeviceInfo.findOne({ where: { id: infoId }})
                    if ( oldInfo ) {
                        DeviceInfo.update({
                            title,
                            description,
                            deviceId: id
                        }, { where: { id: Number( infoId )}})
                    } else {
                        DeviceInfo.create({
                            title,
                            description,
                            deviceId: id
                        })
                    }
                })
            } else {
                // console.log( 'we are here we are here we are here we are here we are here we are here we are here we are here we are here we are here we are here we are here we are here we are here we are here we are here we are here we are here we are here we are here' )
                DeviceInfo.destroy({ where: { deviceId: id }})
            }
            return res.json({ device })
        } catch( e ) {
            next( ApiError.badRequest(( e as Error ).message ))
        }
	}
	async getAll( req: Request, res: Response ) {
        let { brandId, typeId, page = 1, limit = 40, filterKey='name', filterOrder='ASC' } = req.query
        page = Number( page )
        limit = Number( limit )
        const offset: number = page * limit - limit
        let devices: any = []
        const filter: any = [ filterKey, filterOrder ]

        if ( !brandId && !typeId ) {
            devices = await Device.findAndCountAll({ limit, offset, order: [ filter ] })
        }
        if ( brandId && !typeId ) {
            devices = await Device.findAndCountAll({ where: { brandId }, limit, offset, order: [ filter ] })
        }
        if ( !brandId && typeId ) {
            devices = await Device.findAndCountAll({ where: { typeId }, limit, offset, order: [ filter ] })
        }
        if ( brandId && typeId ) {
            devices = await Device.findAndCountAll({ where: { typeId, brandId }, limit, offset, order: [ filter ] })
        }
        return res.json({ devices })
	}
	async getOne( req: Request, res: Response, next: NextFunction ) {
        const { id } = req.params
        const device = await Device.findOne({
            where: { id },
            include: [{ model: DeviceInfo, as: 'info' }]
        })
        if ( !device ) {
			return next( ApiError.badRequest( 'Device has not been found' ))
		}
        return res.json({ device })
	}
    async remove( req: any, res: Response, next: NextFunction ) {
		let { id } = req.body
		id = Number( id )

		await Device.destroy({ where: { id }})

		return res.json({ removed: true, message: 'Item has been removed' })
	}
}

export default new deviceController()