const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const calendarDaysMonth = require('./utils/functions/functions.js')
const Event = require('./utils/models/event.js')
const User = require('./utils/models/user.js')
const Aircraft = require('./utils/models/aircraft.js')
const Room = require('./utils/models/room.js')
const authenticateToken = require('./utils/functions/autenticateToken')
const redirectIndex = require('./utils/functions/redirectIndex')
const bcrypt = require('bcrypt')



// Initialization
const app = express()
const server = http.createServer(app)
const io = socketio(server)
require('./database')
app.use(express.json()) //to be able to get information from the body in a post 

// Settings
app.set('port', process.env.PORT || 3000)

// Middlewares

// Global Variables

// Routes
const login = require('./routes/login')
app.use('/login', redirectIndex, login)

const users = require('./routes/users')
app.use('/users', authenticateToken, users)

const events = require('./routes/events')
app.use('/events', authenticateToken, events)

const aircraft = require('./routes/aircraft')
app.use('/aircraft', authenticateToken, aircraft)

const rooms = require('./routes/rooms')
app.use('/rooms', authenticateToken, rooms)

app.get('/', authenticateToken, (req, res) => res.sendFile(path.join(__dirname, '/public/index.html')))



// Static Files
app.use(express.static(path.join(path.resolve(path.dirname('')), 'public')));

// Server is listenning
server.listen(app.get('port'), () => {
    console.log(`Server running on port`, app.get('port'))
})


io.on('connection', socket => {
    console.log('New connection')


    // EVENTS

    // Send events
    const sendEvents = async (clientDate, weekStartDay) => {
        clientDate = new Date(clientDate)
        // get client date and first day of the week
        const output = calendarDaysMonth(clientDate, weekStartDay)
        const events = await Event.find(
            {
                startTime: {
                    $gte: output.firstDayDate,
                    $lt: output.lastDayDate // CHECK FOR BUGS: $lte instead?
                }
            }
        )
        // console.log(events);
        socket.emit('update_events', events)
        socket.emit('message', 'Events received from the server')
    }

    // Add event
    socket.on('new_event', async input => {
        const available = await checkAvailability(input)
        if (available) {
            // Create a flight event
            const event = new Event()
            event.type = input.type
            event.startTime = new Date(input.startTime)
            event.endTime = new Date(input.endTime)
            if (input.type === 'flight') {
                event.instructor = input.instructor
                event.student = input.student
                event.aircraft = input.aircraft
                await event.save()
                socket.emit('message', 'The event was saved to the DB')
            } else if (input.type === 'class' || input.type === 'exam') {
                event.instructor = input.instructor
                event.student = input.student
                event.subject = input.subject
                event.room = input.room
                await event.save()
                socket.emit('message', 'The event was saved to the DB')
            } else if (input.type === 'notAvailable') {
                event.asset = input.asset;
                await event.save()
                socket.emit('message', 'The availability was saved to the DB')
            }
            const clientDate = new Date(input.clientDate)
            sendEvents(clientDate, input.weekStartDay);
        } else {
            socket.emit('message', 'The event cannot be added with the current restrictions')
            console.log(`The event cannot be added with the current restrictions`);
        }
    })

    // Edit event
    const editEvent = async function (input) {
        const available = await checkAvailability(input)
        // console.log(`Available: ${available}`);
        if (available) {
            const event = await Event.findById(input._id)
            event.type = input.type
            event.startTime = new Date(input.startTime)
            event.endTime = new Date(input.endTime)
            let updated = false;
            if (input.type === 'flight' || input.type === 'class' || input.type === 'exam' || input.type === 'notAvailable') {
                updated = true;
                if (input.type === 'flight') {
                    event.instructor = input.instructor
                    event.student = input.student
                    event.aircraft = input.aircraft
                } else if (input.type === 'class' || input.type === 'exam') {
                    event.instructor = input.instructor
                    event.student = input.student
                    event.subject = input.subject
                    event.room = input.room
                } else if (input.type === 'notAvailable') {
                    event.asset = input.asset;
                }
            }
            if (updated) {
                await event.save()
                socket.emit('message', `Event ${input._id} updated`)
                console.log(`Event ${input._id} updated`)
            }
            const clientDate = new Date(input.clientDate)
            sendEvents(clientDate, input.weekStartDay);
        } else {
            socket.emit('message', 'The event cannot be edited with the current restrictions')
            console.log(`The event cannot be edited with the current restrictions`);
        }
    }
    socket.on('edit_event', input => { editEvent(input) })

    // Delete event
    const deleteEvent = async function (input) {
        const event = await Event.findByIdAndDelete(input._id)
        socket.emit('message', `Event deleted`)
        console.log(`Event deleted`)
        const clientDate = new Date(input.clientDate)
        sendEvents(clientDate, input.weekStartDay);
    }
    socket.on('delete_event', input => { deleteEvent(input) })

    // Check if an event can be added/edited with the current restrictions
    async function checkAvailability(currentEvent) {
        const events = await Event.find()
        // events.map(event => { console.log(event.type); })
        // const previousEvents = events.filter(event => { event.type === 'notAvailable' })
        const restrictions = []
        for (const event of events) {
            if (event.type === 'notAvailable') {
                restrictions.push(event)
            }
        }
        // console.log(events);
        // console.log(restrictions);
        let available = true;
        restrictions.forEach(restriction => {
            const asset = restriction.asset
            if (currentEvent.aircraft === asset ||
                currentEvent.instructor === asset ||
                currentEvent.student === asset ||
                currentEvent.room === asset ||
                currentEvent.subject === asset) {
                const restrictionStartTime = restriction.startTime;
                const restrictionEndTime = restriction.endTime;
                const eventStartTime = new Date(currentEvent.startTime);
                const eventEndTime = new Date(currentEvent.endTime);
                // console.log(restrictionStartTime);
                // console.log(restrictionEndTime);
                // console.log(eventStartTime);
                // console.log(eventEndTime);
                if ((eventStartTime >= restrictionStartTime && eventStartTime < restrictionEndTime) ||
                    (eventEndTime > restrictionStartTime && eventEndTime <= restrictionEndTime) ||
                    (eventStartTime < restrictionStartTime && eventEndTime > restrictionEndTime)) {
                    available = false;
                }
            }
        });
        // console.log(available);
        return available;
    }

    socket.on('get_events', input => {
        sendEvents(input.clientDate, input.weekStartDay)
    })


    // USERS

    // Send users
    const sendInstructors = async function () {
        const instructors = await User.find({ role: 'instructor' })
        //checkAvailavility(event.startTime, event.endTime, instructors.availability)
        socket.emit('send_instructors', instructors)
        socket.emit('message', 'Received available instructors')
        console.log('Sending available instructors')
    }
    const sendStudents = async function () {
        const students = await User.find({ role: 'student' })
        socket.emit('send_students', students)
        socket.emit('message', 'Received available students')
        console.log('Sending available students')
    }
    const sendUsers = async function () {
        const users = await User.find()
        socket.emit('users_list', users)
        socket.emit('message', 'Received users')
        console.log('Sending users')
    }
    const sendAircraft = async function () {
        const aircraft = await Aircraft.find()
        socket.emit('users_list', aircraft)
        socket.emit('message', 'Received aircraft')
        console.log('Sending aircraft')
    }
    const sendRooms = async function () {
        const rooms = await Room.find()
        socket.emit('users_list', rooms)
        socket.emit('message', 'Received rooms')
        console.log('Sending rooms')
    }
    socket.on('get_instructors', sendInstructors)
    socket.on('get_students', sendStudents)
    socket.on('get_users', sendUsers)
    socket.on('get_aircraft', sendAircraft)
    socket.on('get_rooms', sendRooms)

    // Add user
    const addUser = async function (input) {
        const user = new User()
        user.role = input.role
        user.id = input.id
        // user.age = input.age
        user.name = input.name
        // user.firstName = input.name
        // user.lastName = input.lastName
        user.email = input.email
        // const hashedPassword = await bcrypt.hash(input.password, 10)
        // user.password = hashedPassword
        await user.save()
        socket.emit('message', 'User saved to the DB')
        console.log('User saved to the DB')
        console.log(user);
        sendUsers();
    }
    socket.on('new_user', input => { addUser(input) })

    // Edit user
    const editUser = async function (input) {
        const user = await User.findById(input._id)
        user.id = input.id
        user.role = input.role
        user.age = input.age
        user.name = input.name
        // user.firstName = input.firstName
        // user.lastName = input.lastName
        await user.save()
        socket.emit('message', `User ${input.id} updated`)
        console.log(`User ${input.id} (${input._id}) updated`)
        sendUsers();
    }
    socket.on('edit_user', input => { editUser(input) })

    // Delete user
    socket.on('delete_user', async input => {
        await User.remove({ _id: input._id })
        socket.emit('message', `User ${input.id} deleted`)
        console.log(`User ${input.id} (${input._id}) deleted`)
        sendUsers();
    })


    // OTHER ASSETS

    // Add aircraft
    const addAircraft = async function (input) {
        const aircraft = new Aircraft()
        aircraft.name = input.name
        await aircraft.save()
        socket.emit('message', 'Aircraft saved to the DB')
        console.log('Aircraft saved to the DB')
        console.log(aircraft);
        sendAircraft();
    }
    socket.on('new_aicraft', input => { addAircraft(input) })


    // Add rooms
    const addRooms = async function (input) {
        const room = new Room()
        room.name = input.name
        await room.save()
        socket.emit('message', 'Room saved to the DB')
        console.log('Room saved to the DB')
        console.log(Room);
        sendRooms();
    }
    socket.on('new_aicraft', input => { addAircraft(input) })


    // VIEWS

    // Month calendar
    socket.on('get_month_calendar', input => {
        const clientDate = new Date(input.clientDate)
        const weekStartDay = input.weekStartDay;
        const output = calendarDaysMonth(clientDate, weekStartDay)
        socket.emit('month_calendar', output)
        console.log(`Month calendar sent`);
        sendEvents(clientDate, weekStartDay);
    })

    // Week calendar
    socket.on('get_week_calendar', input => { })

    // Calculate week days (move to different file too?)
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