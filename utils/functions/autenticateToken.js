const jwt = require('jsonwebtoken')

function authenticateToken(req,res,next) {
    console.log(req.headers)
    const authHeader = req.headers['cookie']
    console.log(authHeader.split('=')[1])
    const token = authHeader && authHeader.split('=')[1]
    if ( token == null) return res.sendStatus(401)

    jwt.verify(token, 'shhh', (err,user)=> {
        if (err) return res.sendStatus(403)
        req.user = user
        next()
    })
}

module.exports = authenticateToken