const express = require('express')
const getSavedTracks = require('../controllers/trackController.js')

const router = express.Router()

router.get('/saved', getSavedTracks)

module.exports = router