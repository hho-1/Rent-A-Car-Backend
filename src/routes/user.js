"use strict"
/* -------------------------------------------------------
    NODEJS EXPRESS | CLARUSWAY FullStack Team
------------------------------------------------------- */
const router = require('express').Router()
/* ------------------------------------------------------- */
// routes/user:
const permissions = require('../middlewares/permissions')
const user = require('../controllers/user')

router.route('/')
        .get(permissions.isAdmin, user.list)
        .post(user.create)
router.route('/:id')
        .get(permissions.isLogin, user.read)
        .put(permissions.isLogin, user.update)
        .patch(permissions.isLogin, user.update)               //patch kismi güncelleme yaparken, put komple güncelleme yapar. express js'de default olan patch oldugu icin put'la göndersek de patch gibi kismi olarak yapmak mümkün
        .delete(permissions.isAdmin, user.delete)

        
module.exports = router