import { NextFunction, Response } from 'express'
import { checkToken } from './helper'

export default ( req: any, res: Response, next: NextFunction ) => checkToken( req, res, next )