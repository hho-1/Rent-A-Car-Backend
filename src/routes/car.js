"use strict"


const router = require('express').Router()
/* ------------------------------------------------------- */
// routes/car:

const permissions = require('../middlewares/permissions')
const car = require('../controllers/car')

router.route('/')
        .get(car.list)
        .post(permissions.isAdmin, car.create)
router.route('/:id')
        .get(car.read)
        .put(permissions.isAdmin, car.update)
        .patch(permissions.isAdmin, car.update)               //patch kismi güncelleme yaparken, put komple güncelleme yapar. express js'de default olan patch oldugu icin put'la göndersek de patch gibi kismi olarak yapmak mümkün
        .delete(permissions.isAdmin, car.delete)

        
module.exports = router
