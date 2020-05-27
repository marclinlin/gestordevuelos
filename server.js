const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')


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
        console.log(output);
        socket.emit('month_calendar', output)
    })

    // Calculate month days (monday = 1, sunday = 0, satuday = -1)
    function calendarDaysMonth(clientDate, weekStartingDay) {
        const currentYear = clientDate.getFullYear()
        const currentMonth = clientDate.getMonth()
        const currentDay = clientDate.getDate();

        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        const monthDaysNumber = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
        let a;
        if (weekStartingDay === 'Monday') {
            a = 1
        }
        if (weekStartingDay === 'Sunday') {
            a = 0
        }
        if (weekStartingDay === 'Saturday') {
            a = -1
        }

        // check leap year 
        if (leapYear(currentYear)) {
            monthDaysNumber[1] = 29
        }

        // previous, current and next month names
        const previousMonth = months[clientDate.getMonth() - 1]
        const currentMonthName = months[currentMonth]
        const nextMonth = months[clientDate.getMonth() + 1]

        // first day of the actual month, it's weekday and the date in miliseconds
        const firstDayOfTheMonth = new Date(currentYear, currentMonth, 1)
        const miliseconds = firstDayOfTheMonth.getTime()
        //console.log(firstdayofthemonth)
        const firstDayWeekDay = firstDayOfTheMonth.getDay()
        //console.log(firstdayweekday)

        // Calculation of the days to send to frontend
        const days = []
        // past month days
        for (let i = firstDayWeekDay - a; i > 0; i--) {
            //console.log(i)
            const pastDays = new Date(miliseconds - 86400000 * i).getDate()
            days.push(pastDays)
        }
        //current month days
        for (let i = 1; i < monthDaysNumber[currentMonth] + 1; i++) {
            days.push(i)
        }
        //next month days
        for (let i = 1; i < 15; i++) {
            if (days.length < 42) {
                days.push(i)
            }
        }


        // delete the days to adjust to 35 or 28
        const endOfMonth = days.indexOf(monthDaysNumber[currentMonth])
        if (endOfMonth < 35) {
            days.splice(35, 41)
        }

        if (endOfMonth < 28) {
            days.splice(28, 41)
        }

        const output = {}
        output.currentYear = currentYear
        output.currentMonth = currentMonthName
        output.currentDay = currentDay
        output.previousMonth = previousMonth
        output.nextMonth = nextMonth
        output.weekStartingDay = weekStartingDay
        output.days = days
        console.log(days)
        return output;
    }

    // Check leap year
    function leapYear(year) {
        return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
    }

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
        console.log(firstDayWeekday)

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
