"use strict"
/* -------------------------------------------------------
    NODEJS EXPRESS | CLARUSWAY FullStack Team
------------------------------------------------------- */
const { mongoose } = require('../configs/dbConnection')
/* ------------------------------------------------------- *
{
    "username": "admin",
    "password": "1234",
    "email": "admin@site.com",
    "firstName": "admin",
    "lastName": "admin",
    "isActive": true,
    "isAdmin": true
}
{
    "username": "test",
    "password": "1234",
    "email": "test@site.com",
    "firstName": "test",
    "lastName": "test",
    "isActive": true,
    "isAdmin": false
}
/* ------------------------------------------------------- */
// User Model:

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        trim: true,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true,
    },
    firstName: {
        type: String,
        trim: true,
        required: true,
    },
    lastName: {
        type: String,
        trim: true,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    
    
}, {
    collection: 'users',
    timestamps: true
})


const passwordEncrypt = require('../helpers/passwordEncrypt')

//! mongoose middleware (Trigger)
UserSchema.pre('save', function(next){
    const isMailValidated = this.email ? /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.email) : true            //regex ifadelere bu sekilde test yazilabiliyor
    //console.log(isMailValidated);

    if(isMailValidated){
        if(this?.password){
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#]).{8,}$/
            const isPasswordValidated = passwordRegex.test(this.password)

            if(isPasswordValidated){
                this.password = passwordEncrypt(this.password)
            }
            else{
                next(new Error('Password is not valid.'))
            }
        }
        // else{
        //     next(new Error('Enter password'))
        // }
        next()
    }
    else{
        next(new Error('Email is not valid.'))
    }
})

module.exports=mongoose.model('User', UserSchema)