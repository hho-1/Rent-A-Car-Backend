"use strict"


const router = require('express').Router()
/* ------------------------------------------------------- */
// routes/car:

const car = require('../controllers/car')

router.route('/')
        .get(car.list)
        .post(car.create)
router.route('/:id')
        .get(car.read)
        .put(car.update)
        .patch(car.update)               //patch kismi güncelleme yaparken, put komple güncelleme yapar. express js'de default olan patch oldugu icin put'la göndersek de patch gibi kismi olarak yapmak mümkün
        .delete(car.delete)

        
module.exports = router
