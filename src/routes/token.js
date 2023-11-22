"use strict"
/* -------------------------------------------------------
    NODEJS EXPRESS | CLARUSWAY FullStack Team
------------------------------------------------------- */
const router = require('express').Router()
/* ------------------------------------------------------- */
// routes/token:

const {isAdmin} = require('../middlewares/permissions')    //Tek bir fonksiyona ihtioyacimiz varsa bu sekilde cagirabiliriz
const token = require('../controllers/token')

router.use(isAdmin)

router.route('/')
        .get(token.list)
        .post(token.create)
router.route('/:id')
        .get(token.read)
        .put(token.update)
        .patch(token.update)               //patch kismi güncelleme yaparken, put komple güncelleme yapar. express js'de default olan patch oldugu icin put'la göndersek de patch gibi kismi olarak yapmak mümkün
        .delete(token.delete)

        
module.exports = router