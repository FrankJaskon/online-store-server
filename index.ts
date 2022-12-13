import dotenv from 'dotenv'
import express, { Express } from 'express'
import sequelize from './db'
import cors from 'cors'
import models from './models/models'
import router from './routes'

dotenv.config()

const PORT = process.env.PORT || 5000

const app: Express = express()
app.use( cors() )
app.use( express.json() )
app.use( '/api', router )

// app.get( '/', ( req, res ) => {
//     res.status( 200 ).json( { message: 'Well done' } )
// })

const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        app.listen( PORT, () => console.log( `Well, server has been started on port: ${ PORT }` ))
    }
    catch( error ) {
        console.log( error )
    }
}

start()

