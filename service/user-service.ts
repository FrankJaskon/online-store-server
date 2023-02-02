import ApiError, { INCORRECT_DATA, LINK_ACTIVATION_INCORRECT, UNAUTHORIZED, USER_EXISTS } from '../error/ApiError'
import jwt from 'jsonwebtoken'
import { Basket, User } from '../models/models'
import bcrypt from 'bcrypt'
import { v4 } from 'uuid'
import mailService from './mail-service'
import tokenService from './token-service'
import UserDto from '../dto'

class UserService {
    async generateTokensAndResData( user: any ) {
        const userDto = new UserDto( user )
        const tokens = tokenService.generateTokens({ ...userDto })
        await tokenService.saveToken( user.id, tokens.refreshToken )
        return { ...tokens, user: userDto }
    }
    async registration( email:string, password:string ) {
        if ( !email || !password ) {
            throw ApiError.badRequest( INCORRECT_DATA )
        }
        const candidate = await User.findOne({ where: { email } })
        if ( candidate ) {
            throw ApiError.badRequest( USER_EXISTS )
        }

        const hasPassword = await bcrypt.hash( password, 5 )
        const activationLink = v4()
        const user: any = await User.create({ email, password: hasPassword, activationLink })
        const basket = await Basket.create({ userId: user.id })
        await mailService.sendActivationMail( email, `${ process.env.API_URL }/api/user/activate/${ activationLink }` )

        const res = this.generateTokensAndResData( user )
        return res
    }
    async login( email:string, password:string ) {
        const user: any = await User.findOne({ where: { email } })
        if ( !user ) {
            throw ApiError.badRequest( INCORRECT_DATA )
        }
        const comparePassword = await bcrypt.compare( password, user.password )
        if ( !comparePassword ) {
            throw ApiError.badRequest( INCORRECT_DATA )
        }

        const res = this.generateTokensAndResData( user )
        return res
    }
    async activate( activationLink: string ) {
        const user = await User.findOne({ where: { activationLink }})
        if ( !user ) {
            throw ApiError.badRequest( LINK_ACTIVATION_INCORRECT )
        }
        await User.update({ isActivated: true }, { where: { activationLink }})
    }
    async logout( token: string ) {
        return await tokenService.removeToken( token )
    }
    async refresh( refreshToken: string ) {
        if ( !refreshToken ) {
            throw ApiError.unauthorized( UNAUTHORIZED )
        }
        const userData: any = tokenService.validateRefreshToken( refreshToken )
        const tokenFromDb = await tokenService.findOneToken( refreshToken )
        if ( !userData || !tokenFromDb ) {
            throw ApiError.unauthorized( UNAUTHORIZED )
        }
        const user = await User.findOne({ where: { id: userData.id }})
        const res = this.generateTokensAndResData( user )
        return res

    }
}

export default new UserService()