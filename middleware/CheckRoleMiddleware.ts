import { Response, NextFunction } from 'express'
import { checkToken } from './helper'

export default ( role: string | string[] ) => ( req: Request, res: Response, next: NextFunction ) => checkToken( req, res, next, role )