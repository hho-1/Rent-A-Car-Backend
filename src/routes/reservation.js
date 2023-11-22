"use strict"


const router = require('express').Router()
/* ------------------------------------------------------- */
// routes/reservation:

const permissions = require('../middlewares/permissions')
const Reservation = require('../controllers/reservation')

router.route('/')
        .get(permissions.isLogin, Reservation.list)
        .post(permissions.isLogin, Reservation.create)
router.route('/:id')
        .get(permissions.isLogin, Reservation.read)
        .put(permissions.isAdmin, Reservation.update)
        .patch(permissions.isAdmin, Reservation.update)               //patch kismi güncelleme yaparken, put komple güncelleme yapar. express js'de default olan patch oldugu icin put'la göndersek de patch gibi kismi olarak yapmak mümkün
        .delete(permissions.isAdmin,Reservation.delete)

        
module.exports = router
