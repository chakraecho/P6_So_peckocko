const express = require('express')
const router = express.Router()
const multer = require('./../middleware/multer')

const sauceCtrl = require('./../controllers/sauce.js')


router.get('/', sauceCtrl.getAll)
router.post('/', multer, sauceCtrl.createSauce)
router.get('/:id', sauceCtrl.getOne)
router.put('/:id',multer, sauceCtrl.modifyOne)
router.delete('/:id', sauceCtrl.deleteOne)
module.exports = router