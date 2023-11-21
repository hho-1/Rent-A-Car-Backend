"use strict"


const router = require('express').Router()
/* ------------------------------------------------------- */
// routes/reservation:


const Reservation = require('../controllers/reservation')

router.route('/')
        .get(Reservation.list)
        .post(Reservation.create)
router.route('/:id')
        .get(Reservation.read)
        .put(Reservation.update)
        .patch(Reservation.update)               //patch kismi güncelleme yaparken, put komple güncelleme yapar. express js'de default olan patch oldugu icin put'la göndersek de patch gibi kismi olarak yapmak mümkün
        .delete(Reservation.delete)

        
module.exports = router
