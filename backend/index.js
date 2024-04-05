const express = require('express')
const createTables = require('./db/createTables')
const authRouter = require('./routers/auth')
const destinationRouter = require('./routers/destinations')
const flightRouter = require('./routers/flights')

const app = express()

app.use(express.json())
app.use('/', authRouter)
app.use('/destinations', destinationRouter)
app.use('/flights', flightRouter)

app.listen('3000', () => {
    console.log('Server started on port 3000')
})