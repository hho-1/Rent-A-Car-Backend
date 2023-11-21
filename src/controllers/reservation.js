"use strict"


// Reservation Controller:

const Reservation = require('../models/reservation')

module.exports={
    list: async (req, res) => {
        const data = await res.getModelList(Reservation)   //find yerine bunu yapiyoruz cünkü pagination sayfasindaki search sort gibi seylerin aktif olabilmesi icin getModelList kullaniyoruz.

        res.status(200).send({
            error: false,
            detail: await res.getModelListDetails(Reservation),
            data
        })
    },
    create: async (req, res) => {

        const data = await Reservation.create(req.body)

        res.status(201).send({
            error: false,
            data
        })
    },
    read: async (req, res) => {
        const data = await Reservation.findOne({_id: req.params.id})

        res.status(200).send({
            error: false,
            data
        })
    },
    update: async (req, res) => {
        const data = await Reservation.updateOne({_id: req.params.id}, req.body, {runValidators: true})

        res.status(202).send({
            error: false,
            data,
            new: await Reservation.findOne({_id: req.params.id})
        })
    },
    delete: async (req, res) => {
        const data = await Reservation.deleteOne({_id: req.params.id})

        res.status(data.deletedCount ? 202 : 404).send({
            error: false,
            data
        })
    },
}