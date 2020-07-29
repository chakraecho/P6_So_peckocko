const express = require('express')
const router = express.Router()
const userCtrl = require('./../controllers/users.js')
const limit = require('./../middleware/express-limit.js')

router.post('/signup',limit, userCtrl.signup);
router.post('/login',limit, userCtrl.login);

module.exports = router;
