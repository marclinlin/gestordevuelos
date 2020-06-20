const express = require('express')
const router = express.Router();
const path = require('path')
const User = require('../utils/models/user.js')
const jwt = require('jsonwebtoken')
const bycript = require('bcrypt')

router.use(express.json())
router.use(express.urlencoded({extended: true}))

// Manage
router.get('/', (req, res, next) => {
    res.sendFile(path.join(__dirname, '..', '/public/login.html')) 
})

router.post('/', async (req, res, next) => {
    // Authenticate user
    const {username, password} = req.body
    console.log(req.body)
    const user = await User.findOne({ name: username })
    if(!user) return console.log ('User does not exist')
    if(user) {
        if ( user.name === username && user.password === password){ // await bycript.compare(user.password, password)
            
            console.log('Login successfully')
            const userdata= {name: user.name, role: user.role}

            const accessToken = jwt.sign(userdata, 'shhh')
            res.cookie('jwt', accessToken, { httpOnly: true, secure: false}).redirect('/')
        } else{
            console.log('error')
        }
    }

})

router.post('/logout', (req, res) => res.clearCookie('jwt'))



module.exports = router