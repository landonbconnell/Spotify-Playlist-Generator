const express = require('express')
const { getNamesAndDescriptions, getNameAndDescriptionByKeyword } = require('../controllers/playlistController.js')

const router = express.Router()

router.get('/getNamesAndDescriptions', getNamesAndDescriptions)
router.get('/getNameAndDescriptionByKeyword/:keywords', getNameAndDescriptionByKeyword)

module.exports = router