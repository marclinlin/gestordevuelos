const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const calendarDaysMonth = require('./utils/functions.js')
const Event = require('./utils/models.js')

// Initialization
const app = express()
const server = http.createServer(app)
const io = socketio(server)
require('./database')

// Settings
app.set('port', process.env.PORT || 3000)

// Middlewares

// Global Variables

// Routes

// Static Files
app.use(express.static(path.join(path.resolve(path.dirname('')), 'public')));

// Server is listenning
server.listen(app.get('port'), () => {
    console.log(`Server running on port`, app.get('port'))
})


io.on('connection', socket => {
    console.log('New connection')

    socket.on('get_month_calendar', input => {
        const clientDate = new Date(input.clientDate)
        const weekStartDay = input.weekStartDay;
        const output = calendarDaysMonth(clientDate, weekStartDay)
        socket.emit('month_calendar', output)
        console.log(`Month calendar sent`);
    })
    // Create a event
    // const event = new Event()
    // event.title = 'asda'
    // event.description = 'tora'
    // event.status = true
    // event.save()

    // update a event
    // let { id } = ; // insert ID
    // event.title = 'asda'
    // event.description = 'tora'
    // event.status = true
    // Event.update({_id: id});

    // delete event
    // let { id } =  // gather ID
    // await Task.remove({_id: id}); //
    
    // find events
    //const tasks = await Task.find();


    

    // Calculate week days
    function calendarDaysWeek(clientDate, weekStartDay) {
        const days = []
        const output = {}

        if (weekStartDay === 'monday') {
            a = 1
        }
        if (weekStartDay === 'sunday') {
            a = 0
        }
        if (weekStartDay === 'saturday') {
            a = -1
        }

        const date = new Date() // Replace with clientDate
        const currentWeekDay = date.getDay()
        const currentlDay = date.getDate()
        const currentMilliseconds = date.getTime()
        const firstDayWeekday = date.getDay()
        // console.log(firstDayWeekday)

        // past week days
        for (let i = firstDayWeekday - a; i > 0; i--) {
            let pastDays = new Date(currentMilliseconds - 86400000 * i).getDate()
            days.push(pastDays)
        }

        //next week days
        for (let i = 0; i < 8; i++) {
            if (days.length < 7) {
                let futureDays = new Date(currentMilliseconds + 86400000 * i).getDate()
                days.push(futureDays)
            }
        }
        return output
    }


})
