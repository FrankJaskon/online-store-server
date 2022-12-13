import { NextFunction, Request, Response } from 'express'
import { v4 } from 'uuid'
import path from 'path'
import { Device, DeviceInfo } from '../models/models'
import ApiError from '../error/ApiError'

interface InfoField {
    title: string
    description: string
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
                    DeviceInfo.create( {
                        title,
                        description,
                        deviceId: device.id
                    } )
                })
            }

            return res.json( device )
        } catch( e ) {
            next( ApiError.badRequest( ( e as Error ).message ))
        }
	}
	async getAll( req: Request, res: Response ) {
        const { brandId, typeId } = req.query
        let { page = 1, limit = 9 } = req.query
        page = Number( page )
        limit = Number( limit )
        const offset: number = page * limit - limit
        let devices: any = []

        if ( !brandId && !typeId ) {
            devices = await Device.findAndCountAll( { limit, offset } )
        }
        if ( brandId && !typeId ) {
            devices = await Device.findAndCountAll( { where: { brandId }, limit, offset } )
        }
        if ( !brandId && typeId ) {
            devices = await Device.findAndCountAll( { where: { typeId }} )
        }
        if ( brandId && typeId ) {
            devices = await Device.findAndCountAll( { where: { typeId, brandId }} )
        }
        return res.json( devices )
	}
	async getOne( req: Request, res: Response ) {
        const { id } = req.params
        const device = await Device.findOne({
            where: { id },
            include: [{ model: DeviceInfo, as: 'info' }]
        })
        return res.json( device )
	}
}

export default new deviceController()