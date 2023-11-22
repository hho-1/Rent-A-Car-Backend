"use strict"

// Car Controller:
const Car = require('../models/car')
const Reservation = require('../models/reservation')

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

        let filters = {}

        if(!req.user?.isAdmin) filters.isPublish = true

        const {start: getStartDate, end: getEndDate} = req.query

        if(getStartDate && getEndDate){
            const reservedCars = await Reservation.find({
                $nor:[
                    {startDate: {$gt: getEndDate}},
                    {endDate: {$lt: getStartDate}}
                ]
            }, {_id: 0, carId: 1}).distinct('carId')          // distinct süslü icinde gelen veriyi direk array icinde göstersin diye yaziliyor
            //console.log(reservedCars);
            /*
            distinct() convert from:
            [
                { carId: new ObjectId("65352f518a9ea121b1ca5001") },
                { carId: new ObjectId("65352f518a9ea121b1ca5002") }
            ]
            to:
            [
                new ObjectId("65352f518a9ea121b1ca5001"),
                new ObjectId("65352f518a9ea121b1ca5002")
            ]
            */

            if(reservedCars.length){
                filters._id = {$nin: reservedCars}
            }
        }
        

        const data = await res.getModelList(Car, filters)   //find yerine bunu yapiyoruz cünkü pagination sayfasindaki search sort gibi seylerin aktif olabilmesi icin getModelList kullaniyoruz.

        res.status(200).send({
            error: false,
            detail: await res.getModelListDetails(Car, filters),
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

        if (req?.user) {
            // Set userIds from login info: 
            req.body.createdId = req.user._id             // createdId'yi kendisi otomatik alsin diye
            req.body.updatedId = req.user._id
        }

        const data = await Car.create(req.body)

        res.status(201).send({
            error: false,
            data
        })
    },
    read: async (req, res) => {

        /*
            #swagger.tags = ["Cars"]
            #swagger.summary = "Get Single Car"
        */
        const data = await Car.findOne({_id: req.params.id})

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
        if (req?.user) {
                // Set userIds from login info:
        
            req.body.updatedId = req.user._id          // updatedId'yi kendisi otomatik alsin diye
        }

        const data = await Car.updateOne({_id: req.params.id}, req.body, {runValidators: true})

        res.status(202).send({
            error: false,
            data,
            new: await Car.findOne({_id: req.params.id})
        })
    },
    delete: async (req, res) => {

        /*
            #swagger.tags = ["Cars"]
            #swagger.summary = "Delete Car"
        */
        const data = await Car.deleteOne({_id: req.params.id})

        res.status(data.deletedCount ? 202 : 404).send({
            error: false,
            data
        })
    },
}