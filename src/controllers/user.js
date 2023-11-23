"use strict"


// User Controller:


const User = require('../models/user')
const Token = require('../models/token')
const passwordEncrypt = require('../helpers/passwordEncrypt')


module.exports={
    list: async (req, res) => {

        /*
            #swagger.tags = ["Cars"]
            #swagger.summary = "List Cars"
            #swagger.description = `
                You can send query with endpoint for search[], sort[], page and limit.
                <ul> Examples:
                    <li>URL/?<b>search[field1]=value1&search[field2]=value2</b></li>
                    <li>URL/?<b>sort[field1]=1&sort[field2]=-1</b></li>
                    <li>URL/?<b>page=2&limit=1</b></li>
                </ul>
            `
        */

        const data = await res.getModelList(User)   //find yerine bunu yapiyoruz cünkü pagination sayfasindaki search sort gibi seylerin aktif olabilmesi icin getModelList kullaniyoruz.

        res.status(200).send({
            error: false,
            detail: await res.getModelListDetails(User),
            data
        })
    },
    create: async (req, res) => {

        /*
            #swagger.tags = ["Cars"]
            #swagger.summary = "Create Car"
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: { }
            }
        */

        const data = await User.create(req.body)

        let tokenKey = passwordEncrypt(data._id + Date.now())
        let tokenData = await Token.create({ userId: data._id, token:tokenKey })

        res.status(201).send({
            error: false,
            token: tokenData.token,
            data
        })
    },
    read: async (req, res) => {

        /*
            #swagger.tags = ["Cars"]
            #swagger.summary = "Get Single Car"
        */

        // Filters:
        let filters = {}

        if(!req?.user.isAdmin) filters._id = req.user._id


        const data = await User.findOne({_id: req.params.id, ...filters})

        res.status(200).send({
            error: false,
            data
        })
    },
    update: async (req, res) => {

        /*
            #swagger.tags = ["Cars"]
            #swagger.summary = "Update Car"
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: {
                }
            }
        */

        // Filters:
        let filters = {}

        if(!req?.user.isAdmin) {
            filters._id = req.user._id
            req.body.isAdmin = false           // Kendisini admin yapamasin diye
        }

        const data = await User.updateOne({_id: req.params.id, ...filters}, req.body, {runValidators: true})

        res.status(202).send({
            error: false,
            data,
            new: await User.findOne({_id: req.params.id})
        })
    },
    delete: async (req, res) => {
        const data = await User.deleteOne({_id: req.params.id})

        res.status(data.deletedCount ? 202 : 404).send({
            error: false,
            data
        })
    },
}