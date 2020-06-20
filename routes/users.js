const express = require('express')
const router = express.Router();
const path = require('path')

// Manage
router.get('/', (req, res, next) => {
    res.sendFile(path.join(__dirname, '..', '/public/users.html'))
})

module.exports = router