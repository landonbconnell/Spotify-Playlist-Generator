const express = require('express')
const { getNamesAndDescriptions, getNameAndDescriptionByKeyword, generatePlaylists } = require('../controllers/playlistController.js')

const router = express.Router()

router.get('/getNamesAndDescriptions', getNamesAndDescriptions)
router.get('/getNameAndDescriptionByKeyword/:keywords', getNameAndDescriptionByKeyword)
router.post('/generatePlaylists', generatePlaylists)

module.exports = router