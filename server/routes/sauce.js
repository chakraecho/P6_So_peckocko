const express = require('express')
const router = express.Router()
const multer = require('./../middleware/multer')
const auth = require('./../middleware/auth.js')
const sauceCtrl = require('./../controllers/sauce.js')
const sauceAuth = require('./../middleware/sauceAuth.js')

router.get('/',auth, sauceCtrl.getAll)
router.post('/', auth, multer, sauceCtrl.createSauce)
router.get('/:id', auth, sauceCtrl.getOne)
router.put('/:id', auth,sauceAuth, multer, sauceCtrl.modifyOne)
router.delete('/:id', auth, sauceAuth, sauceCtrl.deleteOne)

router.post('/:id/like', auth, sauceCtrl.likeOne)
module.exports = router