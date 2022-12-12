import dotenv from 'dotenv'
import express, { Express } from 'express'

dotenv.config()

const PORT = process.env.PORT || 5000

const app: Express = express()

app.listen( PORT, () => console.log( `Well, server has been started on port: ${ PORT }` ))
