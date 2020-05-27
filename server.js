const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require ('socket.io')


// Initialization
const app = express()
const server= http.createServer(app)
const io = socketio(server)
require('./database')

//Settings
app.set('port', process.env.PORT || 3000) 

//Middlewares

//Global Variables
const days =[]
const output = {}
//Routes

//Static Files
app.use(express.static(path.join(path.resolve(path.dirname('')), 'public')));

//Server is listenning
server.listen(app.get('port'), () => {
    console.log(`Server on port`, app.get('port'))
})


io.on('connection', socket => {
    console.log('New connection')

    socket.on('get_calendar_days', date => {
        calendardaysmonth(new Date(),'monday')
        socket.io('calendar_days', output)
    } )
    // Monthly days function
    // monday = 1, sunday = 0, satuday = -1,  
    function calendardaysmonth (actualdate,weekstartday) {
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October','November', 'December'] 
        const monthsdays =[31,28,31,30,31,30,31,31,30,31,30,31]
        let a;
        if(weekstartday === 'monday') {
            a = 1
        }
        if(weekstartday === 'sunday') {
            a = 0
        }
        if(weekstartday === 'saturday') {
            a = -1
        }

        const date = actualdate
        const year = date.getFullYear()
        const month = date.getMonth()


        // check leap year 
        if(leapYear(year)) {
            monthsdays[1] = 29
        }



        // previous actual and next month
        const previousMonth = months[date.getMonth()-1]
        const currentMonth = months[date.getMonth()]
        const nextMonth = months[date.getMonth()+1]

        // first day of the actual month, it's weekday and the date in miliseconds
        const firstdayofthemonth = new Date(year,month,1)
        const miliseconds = firstdayofthemonth.getTime()
        //console.log(firstdayofthemonth)
        const firstdayweekday = firstdayofthemonth.getDay()
        //console.log(firstdayweekday)

        // Calculation of the days to send to frontend
        // past month days
        for (let i = firstdayweekday-a; i > 0; i--) {
                //console.log(i)
                let pastdays = new Date(miliseconds-86400000*i).getDate()
                days.push(pastdays)
        }
        //actual month days
        for (let i=1; i < monthsdays[month]+1; i++) {
            days.push(i)
        }
        //next month days
        for (let i=1; i<15;i++) {
            if(days.length<42) {
                days.push(i)
            }
        }


        // delete the days to adjust to 35 or 28
        const endofmonth = days.indexOf(monthsdays[month])
        if(endofmonth < 35) {
            days.splice(35,41)
        }
        
        if(endofmonth < 28) {
            days.splice(28,41)
        }
        
        output.currentYear = year
        output.currentMonth = currentMonth
        output.previousMonth = previousMonth
        output.nextMonth = nextMonth
        output.firstDayOfWeek = weekstartday
        output.days = days
        console.log(days)

    }
    // leap year function
    function leapYear(year) {
    return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
    }

    // week days function

    const days=[]
    const output = {}
    function calendarDaysWeek(actualDate,weekStartDay) {

        if(weekStartDay === 'monday') {
            a = 1
        }
        if(weekStartDay === 'sunday') {
            a = 0
        }
        if(weekStartDay === 'saturday') {
            a = -1
        }

        const date = new Date()
        const actualWeekDay= date.getDay()
        const actualDay =date.getDate()
        const actualDayMilliseconds = date.getTime()
        const firstDayWeekday = date.getDay()
        console.log(firstDayWeekday)

        // past week days
        for (let i = firstDayWeekday-a; i > 0; i--) {
            let pastDays = new Date(actualDayMilliseconds-86400000*i).getDate()
            days.push(pastDays)
        }
    
        //next week days
        for (let i=0; i<8;i++) {
            if(days.length<7) {
                let futureDays = new Date(actualDayMilliseconds + 86400000*i).getDate()
                days.push(futureDays)
            }
        }   

    }


})
