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

//! Üstte password ve emailde yapacak oldugumuz validate ve set yerine asagidaki gibi de encrypt ve validation islemlerini yapabiliriz.

const passwordEncrypt = require('../helpers/passwordEncrypt')

//! mongoose middleware (Trigger)
//? save runs only in create


UserSchema.pre(['save', 'updateOne'], function(next){           // mongoose arka planda pre-save desteklemedigi icin buraya elle ekleyip o sekilde cözmeye calistik 
    
    const data = this?._update || this         //Hem update hem de create'te veriyi dataya atamis olduk
    console.log(data);
    
    const isMailValidated = data.email ? /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(data.email) : true            //regex ifadelere bu sekilde test yazilabiliyor
    //console.log(isMailValidated);

    if(isMailValidated){
        if(data.password){
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#+]).{8,}$/
            const isPasswordValidated = passwordRegex.test(data.password)

            if(isPasswordValidated){
                data.password = passwordEncrypt(data.password)
                this.password = data.password     // for create
                this._update = data               // for update 
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