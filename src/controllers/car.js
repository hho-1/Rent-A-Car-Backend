"use strict"

// Car Controller:
const Car = require('../models/car')

module.exports={
    list: async (req, res) => {
        const data = await res.getModelList(Car)   //find yerine bunu yapiyoruz cünkü pagination sayfasindaki search sort gibi seylerin aktif olabilmesi icin getModelList kullaniyoruz.

        res.status(200).send({
            error: false,
            detail: await res.getModelListDetails(Car),
            data
        })
    },
    create: async (req, res) => {

        const data = await Car.create(req.body)

        res.status(201).send({
            error: false,
            data
        })
    },
    read: async (req, res) => {
        const data = await Car.findOne({_id: req.params.id})

        res.status(200).send({
            error: false,
            data
        })
    },
    update: async (req, res) => {
        const data = await Car.updateOne({_id: req.params.id}, req.body, {runValidators: true})

        res.status(202).send({
            error: false,
            data,
            new: await Car.findOne({_id: req.params.id})
        })
    },
    delete: async (req, res) => {
        const data = await Car.deleteOne({_id: req.params.id})

        res.status(data.deletedCount ? 202 : 404).send({
            error: false,
            data
        })
    },
}