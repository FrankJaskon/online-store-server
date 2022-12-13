import dotenv from 'dotenv'
import express, { Express } from 'express'
import sequelize from './db'
import cors from 'cors'
import fileupload from 'express-fileupload'
import path from 'path'
import * as models from './models/models'
import router from './routes'
import ErrorHandler from './middleware/ErrorHandlingMiddleware'

dotenv.config()

const PORT = process.env.PORT || 5000

const app: Express = express()
app.use( cors() )
app.use( express.json() )
app.use( ( express.static( path.resolve( __dirname, 'static' ))))
app.use( fileupload( {} ))
app.use( '/api', router )
app.use( ErrorHandler )

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

