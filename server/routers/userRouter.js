const express = require('express')
const { getUserId, getUserPlaylists, getUserAuthorization } = require('../controllers/userController.js')

const router = express.Router()

router.get('/:id', getUserId)
router.get('/:id/playlists', getUserPlaylists)
router.get('/login', getUserAuthorization)

module.exports = router