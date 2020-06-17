const express = require('express')
const router = express.Router();
const path = require('path')
const authenticateToken = require('../utils/functions/autenticateToken')


// Manage
router.get('/',authenticateToken, (req, res, next) => {
    res.sendFile(path.join(__dirname, '..', '/public/events.html'));
})

module.exports = router