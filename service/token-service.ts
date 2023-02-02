import jwt from 'jsonwebtoken'
import ApiError, { SMTH_WENT_WRONG } from '../error/ApiError'
import { Token } from '../models/models'

class TokenService {
    generateTokens( payload: any ) {
        const accessToken = jwt.sign( payload, process.env.JWT_ACCESS_SECRET as jwt.Secret, { expiresIn: '15s' })
        const refreshToken = jwt.sign( payload, process.env.JWT_REFRESH_SECRET as jwt.Secret, { expiresIn: '30d' })
        return {
            accessToken,
            refreshToken,
        }
    }
    validateAccessToken( token: string ) {
        try {
            const userData = jwt.verify( token, process.env.JWT_ACCESS_SECRET as jwt.Secret )
            return userData
        } catch( e ) {
            return null
        }
    }
    validateRefreshToken( token: string ) {
        try {
            const userData = jwt.verify( token, process.env.JWT_REFRESH_SECRET as jwt.Secret )
            return userData
        } catch( e ) {
            return null
        }
    }
    async saveToken( userId: number, refreshToken: string ) {
        const tokenData = await Token.findOne({ where: { userId }})
        if ( tokenData ) {
            const newToken = await Token.update({ refreshToken }, { where: { userId }})
            return newToken
        }
        const token = await Token.create({ refreshToken, userId })
        return token
    }
    async refreshToken( refreshToken: string ) {
        const tokenData = await Token.findOne({ where: { refreshToken }})
        if ( !tokenData ) {
            throw ApiError.badRequest( SMTH_WENT_WRONG )
        }
        const token = await Token.update({ refreshToken }, { where: { refreshToken }})
        return token
    }
    async findOneToken( refreshToken: string ) {
        const token = await Token.findOne({ where: { refreshToken }})
        return token
    }
    async removeToken( refreshToken: string ) {
        const tokenData = await Token.findOne({ where: { refreshToken }})
        if ( !tokenData ) {
            throw ApiError.badRequest( SMTH_WENT_WRONG )
        }
        await Token.destroy({ where: { refreshToken }})
        return { status: 200 }
    }
}

export default new TokenService()