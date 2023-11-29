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
//const permissions = require('./src/middlewares/permissions')

// Accept JSON:
app.use(express.json())

//Call static files from uploadFiles
app.use('./img', express.static('./upload'))       // Bunu yapmazsan frontend yani browser resmi görüntüleyemez

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


//Mail with nodemailer
const nodemailer = require('nodemailer')

// Create Test (Fake) Account:
// nodemailer.createTestAccount().then((email) => console.log(email))     // Tek sefer calistirip kapatalim, yoksa sürekli yeni mail verir
/* const transporter = nodemailer.createTransport({     //connect to mail service
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,   // piyasa alternatifleri tls ya da ssl
    auth:{
        user: 'aotin55drlsxohcc@ethereal.email',        //Bize verilen mail adresi
        pass: 'Q9uAt6x96X79jacPyp'
    }
})  */ 
/* transporter.sendMail({
    from: 'kbvkhvkjhbkjhbkjhbjkh@ethereal.mail',
    to: 'sbfgbgbggbg@example.com',
    subject: 'jhhoh',
    text: ' Hello',
    html: '<b>Hello there</b>'         // text'le ayni sey. html de biray daha süsleyebiliyorsunuz
}, (error, success) => {
    error ? console.log(error) : console.log('Successful');
}) */

//?Email with Gmail

const transporter = nodemailer.createTransport({     //connect to mail service
    service: 'gmail',   // piyasa alternatifleri tls ya da ssl
    auth:{
        user: 'hakkioglu19@gmail.com',        
        pass: 'jhogoihpjhökjökj'         //Buraya gmail sifremizi yazmiyoruz, bunun yerine gmailden bir sifre isteyip onu girecegiz. Google > AccountHome > Securoty > Two-Step Verification > App PAsswords
    }
}) 
//? YandexMail (yandex):
// const transporter = nodemailer.createTransport({
//     service: 'Yandex',
//     auth: {
//         user: 'username@yandex.com',
//         pass: 'password' // your emailPassword
//     }
// })
/* transporter.sendMail({
    from: 'hakkioglu19@gmail.com',
    to: 'qadir@clarusway.com',
    subject: 'jhhoh',
    text: ' Hello',
    html: '<b>Hello there</b>'         // text'le ayni sey. html de biray daha süsleyebiliyorsunuz
}, (error, successInfo) => {
    error ? console.log(error) : console.log('Success: ' + successInfo);
}) */

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