const express = require('express')
const loginController = require('../controllers/loginController')

const router = express.Router()

router.post('/', loginController.loginUser) 
router.post('/re-authenticate/:id', loginController.reAuthenticate)

module.exports = router
