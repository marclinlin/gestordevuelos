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
// event.type = 'class'
// event.startTime = new Date
// event.endTime = new Date
// event.subject = 'Perf'
// event.instructor = 'Ignacio Pablos'
// event.student = 'David Verdeguer'
// event.room = 'A21'
// event.save()

// async function findinstructors() {
// const instructors = await User.find({role:'instructor'})
// console.log(instructors)
// }
// findinstructors()

io.on('connection', socket => {
    console.log('New connection')

    const sendEvents = async (clientDate, weekStartDay) => {
        // get client date and first day of the week
        const output = calendarDaysMonth(clientDate, weekStartDay)
        const events = await Event.find(
            {
                startTime: {
                    $gte: output.firsDayDate,
                    $lt: output.lastDayDate
                }
            }
        )
        console.log(events);
        socket.emit('update_events', events)
        socket.emit('message', 'Events received from the server')
    }

    socket.on('get_month_calendar', input => {
        const clientDate = new Date(input.clientDate)
        const weekStartDay = input.weekStartDay;
        const output = calendarDaysMonth(clientDate, weekStartDay)
        socket.emit('month_calendar', output)
        console.log(`Month calendar sent`);
        sendEvents(clientDate, weekStartDay);
    })

    socket.on('new_event', async input => {
        // Create a flight event
        const event = new Event()
        if (input.type === 'flight') {
            event.type = 'flight'
            event.startTime = input.startTime
            event.endTime = input.endTime
            event.instructor = input.instructor
            event.student = input.student
            event.aircraft = input.aircraft
            await event.save()
            socket.emit('message', 'The event was saved to the DB')
        } else if (input.type === 'class') {
            event.type = 'class'
            event.startTime = input.startTime
            event.endTime = input.endTime
            event.subject = input.subject
            event.instructor = input.instructor
            event.student = input.student
            event.room = input.room
            await event.save()
            socket.emit('message', 'The event was saved to the DB')
        } else if (input.type === 'exam') {
            event.type = 'exam'
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
        const clientDate = new Date(input.clientDate)
        sendEvents(clientDate, input.weekStartDay);
    })

    socket.on('available_instructors', async () => {
        const instructors = await User.find({ role: 'instructor' })
        //checkAvailavility(event.startTime, event.endTime, instructors.availability)
        socket.emit('available_instructors', instructors)
        socket.emit('message', 'Received available instructors')
        console.log('Sending available instructors')
    })

    socket.on('available_students', async () => {
        const students = await User.find({ role: 'student' })
        socket.emit('available_students', students)
        socket.emit('message', 'Received available students')
        console.log('Sending available students')
    })

    const sendUsers = async function () {
        const users = await User.find()
        socket.emit('user_list', users)
        socket.emit('message', 'Received users')
        console.log('Sending users')
    }

    socket.on('get_users', sendUsers)

    //Create user
    socket.on('new_user', async input => {
        const user = new User()
        user.role = input.role
        user.id = input.id
        // user.age = input.age
        user.name = input.name
        // user.firstName = input.name
        // user.lastName = input.lastName
        user.email = input.email
        await user.save()
        socket.emit('message', 'User saved to the DB')
        console.log('User saved to the DB')
        console.log(user);
        sendUsers();
    })

    //Edit user
    socket.on('edit_user', async input => {
        const user = await User.findById(input._id)
        user.id = input.id
        user.role = input.role
        user.age = input.age
        user.firstName = input.firstName
        user.lastName = input.lastName
        await user.save()
        socket.emit('message', `User ${input.id} updated`)
        console.log(`User ${input.id} (${input._id}) updated`)
    })

    //Delete user
    socket.on('delete_user', async input => {
        await User.remove({ _id: input._id })
        socket.emit('message', `User ${input.id} deleted`)
        console.log(`User ${input.id} (${input._id}) deleted`)
        sendUsers();
    })

    function checkAvailavility(startTime, endTime, eventTimes) {
        eventTimes.map(element => {
            console.log(element)
            if ((startTime > element[0] && startTime < element[1]) ||
                (endTime > element[0] && endTime < element[1]) ||
                (startTime < element[0] && endTime > element[1])) {
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