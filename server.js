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

// Routes
const users = require('./routes/users')
app.use('/users', users)

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

    const sendEvents = async () => {
        // get client date and first day of the week
        const output = calendarDaysMonth(clientDate,weekStartDay)
        const events = await Event.find(
            {startTime: {
                $gte:output.firsDayDate,
                $lt: output.lastDayDate
            }}
            )
        socket.emit('update_events', events)
        socket.emit('message', 'Events received from the server')
    }

    socket.on('get_month_calendar', input => {
        const clientDate = new Date(input.clientDate)
        const weekStartDay = input.weekStartDay;
        const output = calendarDaysMonth(clientDate, weekStartDay)
        socket.emit('month_calendar', output)
        console.log(`Month calendar sent`);
        sendEvents();
    })

    socket.on('new_event', async input => {
        // Create a flight event
        const event = new Event()
        if (input.type === 'flight') {
            event.typeOfEvent = 'flight'
            event.startTime = input.startTime
            event.endTime = input.endTime
            event.instructor = input.instructor
            event.student = input.student
            event.aircraft = input.aircraft
            event.save()
            socket.emit('message', 'The event was saved to the DB')
        } else if (input.type === 'class') {
            event.typeOfEvent = 'class'
            event.startTime = input.startTime
            event.endTime = input.endTime
            event.subject = input.subject
            event.instructor = input.instructor
            event.student = input.student
            event.room = input.room
            event.save()
            socket.emit('message', 'The event was saved to the DB')
        } else if (input.type === 'exam') {
            event.typeOfEvent = 'exam'
            event.startTime = input.startTime
            event.endTime = input.endTime
            event.subject = input.subject
            event.instructor = input.instructor
            event.student = input.student
            event.room = input.room
            await event.save()
            // const occupied = [input.startTime,input.endTime]
            // const user = await User.findById(input.instructorid)
            // user.occupied = user.occupied.push(occupied)
            socket.emit('message', 'The event was saved to the DB')
        }
    })

    socket.on('available_instructors', async () => {
        const instructors = await User.find({ typeOfUser: 'instructor' })
        //checkAvailavility(event.startTime, event.endTime, instructors.availability)
        socket.emit('available_instructors', instructors)
        socket.emit('message', 'Sending available instructors')
        console.log('Sending available instructors')

    })

    socket.on('available_students', async () => {
        const students = await User.find({ typeOfUser: 'student' })
        socket.emit('available_students', students)
        socket.emit('message', 'Sending available students')
        console.log('Sending available students')
    })

    //Create user
    socket.on('new_user', async input => {
        const user = new User()
        switch(input.role) {
            case 'instructor':
                user.typeOfUser = 'instructor'
                break;
            case 'student':
                user.typeOfUser = 'student'
                break;
            case 'student':
            user.typeOfUser = 'student'
            break;
        }
        user.id = input.id
        // user.age = input.age
        user.firstName = input.name
        // user.lastName = input.lastName

        await users.save()
        socket.emit('message', 'User created')
        console.log('User created')
    })

    //Modify user
    socket.on('modify_user',async input => {
        const user = await User.findById(input._id)
        switch(input.typeOfUser) {
            case 'instructor':
                user.typeOfUser = 'instructor'
                break;
            case 'student':
                user.typeOfUser = 'student'
                break;
            case 'student':
            user.typeOfUser = 'student'
            break;
        }
        user.age = input.age
        user.firstName = input.firstName
        user.lastName = input.lastName
        await users.save()
        socket.emit('message', 'User updated')
        console.log('User updated')
    })

    //Delete user
    socket.on('delete_user', async input =>{
        await users.remove({_id:input._id})
        socket.emit('message', 'User deleted')
        console.log('User deleted')
    } )
    
    function checkAvailavility(startTime, endTime, eventTimes) {
        eventTimes.map(element => {
            console.log(element)
            if((startTime > element[0] && startTime < element[1] )||
            (endTime > element[0] && endTime < element[1] )||
            (startTime < element[0] && endTime > element[1])){
                console.log('not available')
            }

        });

    }


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