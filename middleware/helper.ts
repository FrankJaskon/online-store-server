import { Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import ApiError, { UNAUTHORIZED } from '../error/ApiError'

export const checkToken = ( req: any, res: Response, next: NextFunction, role?: string ) => {
    if ( req.method === 'OPTIONS' ) {
        next()
    }
    try {
        const token = req.headers.authorization?.split( ' ' )[ 1 ]
        if ( !token ) {
            return next( ApiError.unauthorized( UNAUTHORIZED ))
        }
        const decoded: any = jwt.verify( token, process.env.SECRET_KEY as jwt.Secret )
        req.user = decoded
        if ( role ) {
            if ( decoded.role !== role ) {
                return next( ApiError.forbidden( 'You do not have access' ) )
            }
        }
        next()
    } catch( e ) {
        return next( ApiError.unauthorized( UNAUTHORIZED ))
    }
}