import { Response, NextFunction } from 'express'
import { checkToken } from './helper'

export default ( role: string ) => ( req: any, res: Response, next: NextFunction ) => checkToken( req, res, next, role )