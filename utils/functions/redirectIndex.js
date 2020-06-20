const jwt = require('jsonwebtoken')

function redirectIndex(req,res,next) {
    const authHeader = req.headers['cookie']
    //console.log(authHeader.split('=')[1].split('; ')[0])
    const token = authHeader && authHeader.split('=')[1].split('; ')[0]
    if ( token == null) return res.redirect('/login')

    jwt.verify(token, 'shhh', (err,user)=> {
        if (!err) return res.redirect('/')
        console.log(user)
        req.user = user
        next()
    })


}

module.exports = redirectIndex