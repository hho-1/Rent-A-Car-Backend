"use strict"


// Auth Controller:

const User = require('../models/user')
const Token = require('../models/token')
const passwordEncrypt = require('../helpers/passwordEncrypt')
const { token } = require('morgan')

module.exports = {
    login: async (req, res) => {

        /*
            #swagger.tags = ["Authentication"]
            #swagger.summary = "Login"
            #swagger.description = 'Login with username (or email) and password.'
            #swagger.parameters["body"] = {
                in: "body",
                required: true,
                schema: {
                    "username": "test",
                    "password": "1234",
                }
            }
        */

        const { username, email, password} = req.body

        if((username || email) && password){

            const user = await User.findOne({ $or: [{username}, {email}] })

            if( user && user.password == passwordEncrypt(password)){

                if(user.isActive){

                    let tokenData = await Token.findOne({userId: user._id})   //Burada normal tire de kullanilabiliyor ama best practice bu sekilde. mongoose buna izin veriyor normalde

                    if(!tokenData){
                        let tokenKey = passwordEncrypt(user._id + Date.now())
                        tokenData = await Token.create({userId: user._id, token: tokenKey})
                    }
                    res.send({
                        error: false,
                        token: tokenData.token,
                        user
                    })
                }
                else{
                    res.errorStatusCode = 401
                    throw new Error('This account is not active')
                }
            }
            else{
                res.errorStatusCode = 401
                throw new Error('Username or email is wrong')
            }
        }
        else{
            res.errorStatusCode = 401
            throw new Error('please enter username/email and password')
        }

    },
    logout: async (req, res) => {
        /*
            #swagger.tags = ["Authentication"]
            #swagger.summary = "Logout"
            #swagger.description = 'Delete token key.'
        */

            const auth = req.headers?.authorization || null
            const tokenkey = auth ? auth.split(' ')[1] : null 

            //Delete token from db:

            const tokenData = await Token.deleteOne({token: tokenkey})

            res.send({
                error: false,
                message: 'logout was OK',
                data: tokenData
            })
    }
}