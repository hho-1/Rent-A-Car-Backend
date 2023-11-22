"use strict"


const express = require('express')
const app = express()

/* ------------------------------------------------------- */
// Required Modules:

// envVariables to process.env:
require('dotenv').config()
const HOST = process.env?.HOST || '127.0.0.1'
const PORT = process.env?.PORT || 8000

// asyncErrors to errorHandler:
require('express-async-errors')

/* ------------------------------------------------------- */
// Configrations:

// Connect to DB:
const { dbConnection } = require('./src/configs/dbConnection')
dbConnection()

/* ------------------------------------------------------- */
// Middlewares:
const permissions = require('./src/middlewares/permissions')

// Accept JSON:
app.use(express.json())

// Check Authentication:
app.use(require('./src/middlewares/authentication'))

// Run Logger:
app.use(require('./src/middlewares/logger'))

// res.getModelList():
app.use(require('./src/middlewares/findSearchSortPage'))

/* ------------------------------------------------------- */
// Routes:

// HomePath:
app.all('/', (req, res) => {
    res.send({
        error: false,
        message: 'Welcome to RENT A CAR API',
        documents: {
            swagger: '/documents/swagger',
            redoc: '/documents/redoc',
            json: '/documents/json',
        },
        user: req.user
    })
})

// Routes:
//app.use(require('./src/routes'))
app.use('/auth', require('./src/routes/auth'))

app.use('/cars', require('./src/routes/car'))
app.use('/reservations', require('./src/routes/reservation'))
app.use('/users', require('./src/routes/user'))
app.use('/tokens', require('./src/routes/token'))

/* ------------------------------------------------------- */

// errorHandler:
app.use(require('./src/middlewares/errorHandler'))

// RUN SERVER:
app.listen(PORT, HOST, () => console.log(`http://${HOST}:${PORT}`))

/* ------------------------------------------------------- */
// Syncronization (must be in commentLine):
// require('./src/helpers/sync')()                     // helpers'daki sync dosyasindan veri alabilmek icin