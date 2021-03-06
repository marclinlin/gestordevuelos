const jwt = require('jsonwebtoken')

function authenticateToken(req,res,next) {
    //console.log(req.headers.cookie)
    const authHeader = req.headers['cookie']
    //console.log(authHeader.split('=')[1].split('; ')[0])
    const token = authHeader && authHeader.split('=')[1].split('; ')[0]
    if ( token == null) return res.redirect('/login')

    jwt.verify(token, 'shhh', (err,user)=> {
        if (err) return res.redirect('/login')
        //console.log(user)
        req.user = user // add to the request the user with the role
        next()
    })
}


module.exports = authenticateToken