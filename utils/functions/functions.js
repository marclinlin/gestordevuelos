// functions

// Calculate month days (monday = 1, sunday = 0, satuday = -1)
function calendarDaysMonth(clientDate, weekStartingDay) {
    const currentYear = clientDate.getFullYear()
    const currentMonth = clientDate.getMonth()
    const currentDay = clientDate.getDate()
    const output = {};

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


    // date of the first and last day of the days array

    if (days[0] === 1) {
        const firstDayDate = new Date(currentYear, currentMonth, days[0])
        output.firstDayDate = firstDayDate
    } else {
        const firstDayDate = new Date(currentYear, currentMonth - 1, days[0])
        output.firstDayDate = firstDayDate

    }
    if (days[days.length - 1] < 15) {
        const lastDayDate = new Date(currentYear, currentMonth + 1, days[days.length - 1])
        output.lastDayDate = lastDayDate

    } else {
        const lastDayDate = new Date(currentYear, currentMonth + 1, days[days.length - 1])
        output.lastDayDate = lastDayDate

    }

    output.currentYear = currentYear
    output.currentMonth = currentMonthName
    output.currentDay = currentDay
    output.previousMonth = previousMonth
    output.nextMonth = nextMonth
    output.weekStartingDay = weekStartingDay
    output.days = days
    // console.log(days)
    return output;
}

// Check leap year
function leapYear(year) {
    return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
}



module.exports = calendarDaysMonth
