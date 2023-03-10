import sequelize from '../db'
import { DataTypes } from 'sequelize'

export const User = sequelize.define( 'user', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.STRING, defaultValue: 'USER' },
    isActivated: { type: DataTypes.BOOLEAN, defaultValue: false },
    activationLink: { type: DataTypes.STRING },
})

export const Token = sequelize.define( 'token', {
    refreshToken: { type: DataTypes.STRING, allowNull: false },
})

export const Basket = sequelize.define( 'basket', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
})

export const BasketDevice = sequelize.define( 'basket_device', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    count: { type: DataTypes.INTEGER, defaultValue: 1 }
})

export const Device = sequelize.define( 'device', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, unique: true, allowNull: false },
    price: { type: DataTypes.INTEGER, allowNull: false },
    rating: { type: DataTypes.REAL( 3, 1 ), defaultValue: 0 },
    img: { type: DataTypes.STRING, allowNull: false },
})

export const Type = sequelize.define( 'type', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, unique: true, allowNull: false },
})

export const Brand = sequelize.define( 'brand', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, unique: true, allowNull: false },
})

export const Rating = sequelize.define( 'rating', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    grade: { type: DataTypes.REAL( 3, 1 ), allowNull: false },
})

export const DeviceInfo = sequelize.define( 'device_info', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: false },
})

export const TypeBrand = sequelize.define( 'type_brand', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
})

User.hasOne( Basket )
Basket.belongsTo( User )

User.hasOne( Token )
Token.belongsTo( User )

User.hasMany( Rating )
Rating.belongsTo( User )

Basket.hasMany( BasketDevice )
BasketDevice.belongsTo( Basket )

Device.hasMany( BasketDevice )
BasketDevice.belongsTo( Device )

Device.hasMany( Rating )
Rating.belongsTo( Device )

Device.hasMany( DeviceInfo, { as: 'info' } )
DeviceInfo.belongsTo( Device )

Type.hasMany( Device )
Device.belongsTo( Type )

Brand.hasMany( Device )
Device.belongsTo( Brand )

Type.belongsToMany( Brand, { through: TypeBrand } )
Brand.belongsToMany( Type, { through: TypeBrand } )