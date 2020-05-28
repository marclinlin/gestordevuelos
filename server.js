const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const calendarDaysMonth = require('./utils/functions.js')
const Event = require('./utils/models/event.js')
const User = require('./utils/models/user.js')
const mongoose = require('mongoose');


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


// const event = new Event()
// event.typeOfEvent = 'class'
// event.startTime = new Date
// event.endTime = new Date
// event.subject = 'Perf'
// event.instructor = 'Ignacio Pablos'
// event.student = 'David Verdeguer'
// event.room = 'A21'
// event.save()

// async function findinstructors() {
// const instructors = await User.find({typeOfUser:'instructor'})
// console.log(instructors)
// }
// findinstructors()

io.on('connection', socket => {
    console.log('New connection')

    socket.on('get_month_calendar', input => {
        const clientDate = new Date(input.clientDate)
        const weekStartDay = input.weekStartDay;
        const output = calendarDaysMonth(clientDate, weekStartDay)
        socket.emit('month_calendar', output)
        console.log(`Month calendar sent`);
    })

    socket.on('new_event', input => {
        // Create a flight event
        const event = new Event()
        if(input.type === 'flight'){
            event.typeOfEvent = 'flight'
            event.startTime = input.startTime
            event.endTime = input.endTime
            event.instructor = input.instructor
            event.student = input.student
            event.aircraft = input.aircraft
            event.save()
        }
        if(input.type === 'class'){
            event.typeOfEvent = 'class'
            event.startTime = input.startTime
            event.endTime = input.endTime
            event.subject = input.subject
            event.instructor = input.instructor
            event.student = input.student
            event.room = input.room
            event.save()
        }
        if(input.type === 'exam'){
            event.typeOfEvent = 'exam'
            event.startTime = input.startTime
            event.endTime = input.endTime
            event.subject = input.subject
            event.instructor = input.instructor
            event.student = input.student
            event.room = input.room
            event.save()
        }
        const events = async () => {
            await Event.find()
        } 
        console.log(events)
        socket.emit('update_events', events)

    })


    socket.on('available_instructors', async () => {
        const instructors = await User.find({typeOfUser:'instructor'})
        socket.emit('available_instructors', instructors)
    })

    socket.on('available_students', async () => {
        const students = await User.find({typeOfUser:'student'})
        socket.emit('available_students', students)
    })
   

    // update a event
    // let { id } = ; // insert ID
    // event.title = 'asda'
    // event.description = 'tora'
    // event.status = true
    // Event.update({_id: id});

    // delete event
    // let { id } =  // gather ID
    // await Task.remove({_id: id}); //
    
    


    

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

        // past weekdays
        for (let i = firstDayWeekday - a; i > 0; i--) {
            let pastDays = new Date(currentMilliseconds - 86400000 * i).getDate()
            days.push(pastDays)
        }

        //next weekdays
        for (let i = 0; i < 8; i++) {
            if (days.length < 7) {
                let futureDays = new Date(currentMilliseconds + 86400000 * i).getDate()
                days.push(futureDays)
            }
        }
        return output
    }


})
