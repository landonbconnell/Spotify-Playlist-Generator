const express = require('express')
const { getNamesAndDescriptions } = require('../controllers/playlistController.js')

const router = express.Router()

router.get('/getNamesAndDescriptions', getNamesAndDescriptions)

module.exports = router