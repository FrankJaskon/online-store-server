import { INCORRECT_DATA } from '../error/ApiError'
import { Basket, User } from '../models/models'
import bcrypt from 'bcrypt'
import { v4 } from 'uuid'
import mailService from './mail-service'
import tokenService from './token-service'
import UserDto from '../dto'

class UserService {
    async registration( email:string, password:string ) {
        if ( !email || !password ) {
            throw new Error( INCORRECT_DATA )
        }
        const candidate = await User.findOne({ where: { email } })
        if ( candidate ) {
            throw new Error( 'User with this Email already exists' )
        }
        const hasPassword = await bcrypt.hash( password, 5 )
        const activationLink = v4()
        const user: any = await User.create({ email, password: hasPassword })
        const basket = await Basket.create({ userId: user.id })
        await mailService.sendActivationMail( email, activationLink )

        const userDto = new UserDto( user )
        const tokens = tokenService.generateTokens({ ...userDto })
        await tokenService.saveToken( user.id, tokens.refreshToken )

        return { ...tokens, user: userDto }
    }
}

export default new UserService()