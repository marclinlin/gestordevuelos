const express = require('express')
const router = express.Router();
const path = require('path')
const User = require('../utils/models/user.js')
const jwt = require('jsonwebtoken')
const authenticateToken = require('../utils/functions/autenticateToken')

// Manage
router.get('/', (req, res, next) => {
    res.sendFile(path.join(__dirname, '..', '/public/events.html')) //TODO: add the correct html
})

router.post('/', async (req, res, next) => {
    // Authenticate user
    const {username, password} = req.body
    const user = await User.findOne({ name: username })
    if(!user) return console.log ('User does not exist')
    if(user) {
        if ( user.name === username || user.password === password){
            
            console.log('Login successfully')
            const userdata= {name:username, role: user.role}

            const accessToken = jwt.sign(userdata, 'shhh')
            res.cookie('jwt', accessToken, { httpOnly: true, secure: true}).sendFile(path.join(__dirname, '..', '/public/events.html')) //TODO: add the correct html
        } else{
            console.log('error')
        }
    }

})



module.exports = router