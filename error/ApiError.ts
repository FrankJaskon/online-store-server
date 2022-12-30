export const UNAUTHORIZED: 'User is not authorized' = 'User is not authorized'
export const INCORRECT_DATA: 'Email or password is incorrect' = 'Email or password is incorrect'
export const SMTH_WENT_WRONG: 'Something went wrong' = 'Something went wrong'

export default class ApiError extends Error {
    status: number
    message: string

    constructor( status: number, message: string ) {
        super()
        this.status = status
        this.message = message
    }

    static unauthorized( message: string ): ApiError {
        return new ApiError( 401, message )
    }
    static forbidden( message: string ): ApiError {
        return new ApiError( 403, message )
    }
    static badRequest( message: string ): ApiError {
        return new ApiError( 404, message )
    }
    static internal( message: string ): ApiError {
        return new ApiError( 500, message )
    }
}