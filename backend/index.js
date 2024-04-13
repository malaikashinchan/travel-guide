const express = require('express')
const createTables = require('./db/createTables')
const authRouter = require('./routers/auth')
const destinationRouter = require('./routers/destinations')
const flightRouter = require('./routers/flights')
const reviewsRouter = require('./routers/reviews')
const favoriteRouter = require('./routers/favorite')
const hotelRouter = require('./routers/hotels')
const cors = require('cors')

const app = express()

app.use(express.json())
app.use(cors())
  
app.use('/', authRouter)
app.use('/destinations', destinationRouter)
app.use('/flights', flightRouter)
app.use('/reviews', reviewsRouter)
app.use('/favorite', favoriteRouter)
app.use('/hotels', hotelRouter) 

app.listen('3000', () => {
    console.log('Server started on port 3000')
}) 