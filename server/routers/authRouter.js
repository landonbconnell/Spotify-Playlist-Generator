const express = require('express')
const { authRequest, getAccessToken } = require('../controllers/authController.js')

const router = express.Router()

router.get('/login', authRequest)
router.get('/getAccessToken/:code', getAccessToken)

module.exports = router