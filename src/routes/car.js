"use strict"


const router = require('express').Router()
/* ------------------------------------------------------- */
// routes/car:

const permissions = require('../middlewares/permissions')
const car = require('../controllers/car')

//Uploading files (Multer) (npm i multer)       upload middleware'ine tasidik
/* const multer = require('multer')
const upload = multer({
    storage: multer.diskStorage({
        destination: './upload',          // Bunu yapinca solda upload isminde bir klasör olustu
        filename: function(req, file, returnCallback){
                //returnCallback(error, this.filename)
                returnCallback(null, file.originalname)     // Orijinal ismiyle kaydetmek icin
        }
    })    
}) */
const upload = require('../middlewares/upload')

router.route('/')
        .get(car.list)
        .post(permissions.isAdmin, car.create)          //upload.single: tek dosya yükleme, image --> field adi, upload.array: Birden fazla dosya yükleme
router.route('/:id')
        .get(car.read)
        .put(permissions.isAdmin, upload.array('image'), car.update)                  //upload.any: cok güvenilir degil, array kullanmak en mantiklisi
        .patch(permissions.isAdmin, car.update)               //patch kismi güncelleme yaparken, put komple güncelleme yapar. express js'de default olan patch oldugu icin put'la göndersek de patch gibi kismi olarak yapmak mümkün
        .delete(permissions.isAdmin, car.delete)

        
module.exports = router
