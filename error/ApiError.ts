export const UNAUTHORIZED: 'User is not authorized' = 'User is not authorized'
export const USER_EXISTS: 'User with this Email already exists' = 'User with this Email already exists'
export const INCORRECT_DATA: 'Email or password is incorrect' = 'Email or password is incorrect'
export const SMTH_WENT_WRONG: 'Something went wrong' = 'Something went wrong'
export const LINK_ACTIVATION_INCORRECT: 'The activation link is wrong' = 'The activation link is wrong'

export default class ApiError extends Error {
    status: number
    errors: any

    constructor( status: number, message: string, errors = [] ) {
        super( message )
        this.status = status
        this.errors = errors
    }

    static unauthorized( message: string ): ApiError {
        return new ApiError( 401, message )
    }
    static forbidden( message: string ): ApiError {
        return new ApiError( 403, message )
    }
    static badRequest( message: string, errors: any = undefined ): ApiError {
        return new ApiError( 404, message, errors )
    }
    static internal( message: string ): ApiError {
        return new ApiError( 500, message )
    }
}