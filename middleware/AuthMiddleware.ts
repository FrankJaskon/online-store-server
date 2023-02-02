import { NextFunction, Response } from 'express'
import { checkToken } from './checkToken'

export default ( req: Request, res: Response, next: NextFunction ) => checkToken( req, res, next )