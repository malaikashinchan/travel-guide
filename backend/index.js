const express = require('express')
const pool = require('./config/database') 
const createTables = require('./db/createTables')

const app = express()

app.listen('3002', () => {
    console.log('Server started on port 3002')
})