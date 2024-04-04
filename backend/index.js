const express = require('express')
const pool = require('./config/database') 
const createTables = require('./db/createTables')
const authRouter = require('./routers/auth')
const destinationRouter = require('./routers/destinations')

const app = express()

app.use(express.json())
app.use('/', authRouter)
app.use('/destinations', destinationRouter)

app.listen('3000', () => {
    console.log('Server started on port 3000')
})