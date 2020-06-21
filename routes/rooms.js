const express = require('express')
const router = express.Router();
const path = require('path')
const authenticateToken = require('../utils/functions/autenticateToken')


// Manage
router.get('/', (req, res, next) => {
    console.log(req.user)
    res.sendFile(path.join(__dirname, '..', '/public/rooms.html'));
})

module.exports = router