"use strict"
/* -------------------------------------------------------
    NODEJS EXPRESS | CLARUSWAY FullStack Team
------------------------------------------------------- */
const router = require('express').Router()
/* ------------------------------------------------------- */
// routes/auth:

const auth = require('../controllers/auth')

router.post('/login', auth.login)
router.post('/logout', auth.logout)            //logout hem get hem de post ile calisiyor. all yazabilirdik ama o zaman da swagger bunu yakalamiyor


module.exports = router