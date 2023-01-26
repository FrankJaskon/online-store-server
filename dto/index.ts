class UserDto {
    id: number = 0
    email: string = ''
    role: 'USER' | 'ADMIN' | '' = ''
    isActivated: boolean = false

    constructor( userModel: any ) {
        this.id = userModel.id
        this.email = userModel.email
        this.role = userModel.role
        this.isActivated = userModel.isActivated
    }
}

export default UserDto