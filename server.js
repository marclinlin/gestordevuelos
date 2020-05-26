const express = require('express')
const path = require('path')


// Initialization
const app = express()
require('./database')

//Settings
app.set('port', process.env.PORT || 3000)

//Middlewares

//Global Variables

//Routes

//Static Files
app.use(express.static(path.join(__dirname, 'public')))

//Server is listenning
app.listen(app.get('port'), () => {
    console.log(`Server on port`, app.get('port'))
})
