const express = require('express')
const router = express.Router()
const multer = require('./../middleware/multer')

const sauceCtrl = require('./../controllers/sauce.js')


router.get('/', sauceCtrl.getAll)
router.post('/', multer, sauceCtrl.createSauce)

module.exports = router