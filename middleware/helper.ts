import { Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export const checkToken = ( req: any, res: Response, next: NextFunction, role?: string ) => {
    if ( req.method === 'OPTIONS' ) {
        next()
    }
    try {
        const token = req.headers.authorization?.split( ' ' )[ 1 ]
        if ( !token ) {
            return res.status( 401 ).json({ message: 'User is not authorized' })
        }
        const decoded: any = jwt.verify( token, process.env.SECRET_KEY as jwt.Secret )
        if ( role ) {
            if ( decoded.role !== role ) {
                return res.status( 403 ).json({ message: 'You do not have access' })
            }
        }
        req.user = decoded
        next()
    } catch( e ) {
        res.status( 401 ).json({ message: 'User is not authorized' })
    }
}