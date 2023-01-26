import jwt from 'jsonwebtoken'
import { Token } from '../models/models'

// const generateJwt = ( id: number, email: string, role: string ) => {
// 	const payload = new Object({ id, email, role })
// 	return jwt.sign( payload, process.env.JWT_ACCESS_SECRET as jwt.Secret, { expiresIn: '4h' })
// }

class TokenService {
    generateTokens( payload: any ) {
        const accessToken = jwt.sign( payload, process.env.JWT_ACCESS_SECRET as jwt.Secret, { expiresIn: '30m' })
        const refreshToken = jwt.sign( payload, process.env.JWT_REFRESH_SECRET as jwt.Secret, { expiresIn: '30d' })
        return {
            accessToken,
            refreshToken,
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
}

export default new TokenService()