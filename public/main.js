const socket = io.connect('http://localhost:3000/');

socket.on('message', msg => { console.log(msg); })

// GET MONTH CALENDAR
const calendarParams = {
    clientDate: new Date(),
    weekStartDay: 'Monday'
}
socket.emit('get_month_calendar', calendarParams);
socket.on('month_calendar', input => {
    const currentYear = input.currentYear;
    const currentMonth = input.currentMonth;
    const currentDay = new Date().getDate();
    const previousMonth = input.previousMonth;
    const nextMonth = input.nextMonth;
    const weekStartingDay = input.weekStartingDay;
    const days = input.days;

    const events = [
        {
            day: 19,
            month: 'May',
            startTimeHours: '12',
            startTimeMinutes: '00',
            endTimeHours: '15',
            endTimeMinutes: '30',
            type: 'flight',
            aircraft: 'EC-NAQ',
            instructor: 'Rubén Velázquez'
        },
        {
            day: 22,
            month: 'May',
            startTimeHours: '10',
            startTimeMinutes: '00',
            endTimeHours: '11',
            endTimeMinutes: '30',
            type: 'exam',
            subject: 'Air Law',
            instructor: 'Jordi Adell'
        },
        {
            day: 22,
            month: 'May',
            startTimeHours: '12',
            startTimeMinutes: '00',
            endTimeHours: '15',
            endTimeMinutes: '00',
            type: 'flight',
            aircraft: 'EC-NEM',
            instructor: 'Tomás Losa'
        },
        {
            day: 22,
            month: 'May',
            startTimeHours: '16',
            startTimeMinutes: '00',
            endTimeHours: '21',
            endTimeMinutes: '00',
            type: 'class',
            subject: 'Meteorology',
            instructor: 'Jordi Adell'
        },
        {
            day: 14,
            month: 'May',
            startTimeHours: '12',
            startTimeMinutes: '00',
            endTimeHours: '14',
            endTimeMinutes: '00',
            type: 'exam',
            subject: 'POF',
            instructor: 'Ignacio García'
        }
    ]


    /* CREATE CALENDAR */
    // Add year, month and weekdays
    const weekDays = weekStartingDay === 'Monday' ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] : (weekStartingDay === 'Sunday' ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] : ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
    document.querySelector('div#year').innerHTML = currentYear;
    document.querySelector('div#month').innerHTML = currentMonth;
    const weekDaysList = document.querySelector('div#weekdays')
    weekDays.forEach(weekDay => {
        const newListItem = document.createElement('div')
        newListItem.classList.add('no-select');
        newListItem.innerHTML = weekDay
        weekDaysList.appendChild(newListItem)
    })

    // Add days
    const numberOfDays = days.length;
    const rowsClass = numberOfDays === 42 ? 'six-rows' : (numberOfDays === 35 ? 'five-rows' : 'four-rows')
    const daysElement = document.querySelector('div#days')
    let month = days[0] >= 23 ? previousMonth : currentMonth;
    for (const [index, dayNumber] of days.entries()) {
        if (dayNumber === 1) {
            month = month === previousMonth ? currentMonth : nextMonth
        }
        const newDay = document.createElement('div');
        newDay.setAttribute('id', `${dayNumber}-${month}`)
        newDay.classList.add(rowsClass)
        if (month !== currentMonth) {
            newDay.classList.add('previous-next')
        } else if (dayNumber === currentDay) {
            newDay.classList.add('today')
        }

        // Add a class for borders
        if (numberOfDays === 42 && index === 35 || numberOfDays === 35 && index === 28 || numberOfDays === 28 && index === 21) {
            newDay.classList.add('bottom-left')
        } else if (numberOfDays === 42 && index === 41 || numberOfDays === 35 && index === 34 || numberOfDays === 28 && index === 27) {
            newDay.classList.add('bottom-right')
        } else if (index === 0) {
            newDay.classList.add('top-left')
        } else if (index === 6) {
            newDay.classList.add('top-right')
        } else if (index % 7 === 0) {
            newDay.classList.add('left')
        } else if (index % 7 === 6) {
            newDay.classList.add('right')
        } else if (index <= 6) {
            newDay.classList.add('top')
        } else if (numberOfDays === 42 && index >= 35 || numberOfDays === 35 && index >= 28 || numberOfDays === 28 && index >= 21) {
            newDay.classList.add('bottom')
        } else {
            newDay.classList.add('center')
        }
        newDay.innerHTML = `<span class="no-select">${days[index]}<span>`;
        daysElement.appendChild(newDay)
    }

    /* ADD EVENTS */

    // Add event button
    document.getElementById('new-event').addEventListener('click', () => {
        if (document.getElementById('overlay').style.display === 'block') {
            off();
        } else {
            on();
        }
    })
    function on() {
        document.getElementById('overlay').style.display = "block";
    }
    function off() {
        document.getElementById('overlay').style.display = "none";
    }

    // Render events (hard-coded so far)
    events.forEach(event => {
        const day = event.day;
        const month = event.month;
        const type = event.type;
        const startTime = `${event.startTimeHours}:${event.startTimeMinutes}`
        // const endTime = `${event.endTimeHours}:${event.endTimeMinutes}`
        const selectDay = document.getElementById(`${day}-${month}`);
        const newEvent = document.createElement('div')
        newEvent.classList.add('event')
        newEvent.classList.add(type)
        newEvent.classList.add('no-select')
        if (type === 'flight') {
            newEvent.innerHTML = `${startTime}`
        } else if (type === 'class' || type === 'exam') {
            newEvent.innerHTML = `${startTime}`
        }
        selectDay.appendChild(newEvent)
        // selectDay.addEventListener('click', createEvent)
    })
    createEvents();
})
socket.on('update_events', events => {

})

function createEvents() {
    /* ADD EVENT FORMS */
    const radios = document.getElementsByName('type-radio');
    const flightForm = document.getElementById('flight-form');
    const classForm = document.getElementById('class-form');
    const examForm = document.getElementById('exam-form');
    /* const simForm = document.getElementById('sim-form');
    const otherForm = document.getElementById('other-form'); */

    // Show forms
    for (let i = 0; i < radios.length; i++) {
        radios[i].onclick = function () {
            const overlay = document.getElementById('overlay');
            const flightLabel = document.getElementById('flight-label')
            const classLabel = document.getElementById('class-label')
            const examLabel = document.getElementById('exam-label')
            if (overlay.classList[0] == 'before-click') {
                overlay.classList.remove('before-click')
                overlay.classList.add('after-click')
            }
            const value = this.value;
            if (value == 'flight') {
                flightLabel.classList.add('active')
                classLabel.classList.remove('active')
                examLabel.classList.remove('active')
                flightForm.style.display = 'block'; // show
                classForm.style.display = 'none'; // hide
                examForm.style.display = 'none'; // hide
            } else if (value == 'class') {
                flightLabel.classList.remove('active')
                classLabel.classList.add('active')
                examLabel.classList.remove('active')
                flightForm.style.display = 'none'; // show
                classForm.style.display = 'block'; // hide
                examForm.style.display = 'none'; // hide
            } else if (value == 'exam') {
                flightLabel.classList.remove('active')
                classLabel.classList.remove('active')
                examLabel.classList.add('active')
                flightForm.style.display = 'none'; // show
                classForm.style.display = 'none'; // hide
                examForm.style.display = 'block'; // hide
            }
        }
    }

    // Submit forms
    flightForm.addEventListener('submit', e => {
        e.preventDefault();
        const startTime = e.target.elements.flightStartTime.value
        const endTime = e.target.elements.flightEndTime.value
        const instructor = e.target.elements.flightInstructor.value
        const student = e.target.elements.student.value
        const aircraft = e.target.elements.aircraft.value

        const output = {
            type: 'flight',
            startTime: startTime,
            endTime: endTime,
            instructor: instructor,
            student: student,
            aircraft: aircraft,
        }
        socket.emit('new_event', output)
    })
    classForm.addEventListener('submit', e => {
        e.preventDefault();
        const startTime = e.target.elements.classStartTime.value
        const endTime = e.target.elements.classEndTime.value
        const subject = e.target.elements.classSubject.value
        const instructor = e.target.elements.classInstructor.value
        const student = e.target.elements.student.value
        const room = e.target.elements.room.value

        const output = {
            type: 'class',
            startTime: startTime,
            endTime: endTime,
            subject: subject,
            instructor: instructor,
            student: student,
            room: room,
        }
        socket.emit('new_event', output)
    })
    examForm.addEventListener('submit', e => {
        e.preventDefault();
        const startTime = e.target.elements.examStartTime.value
        const endTime = e.target.elements.examEndTime.value
        const subject = e.target.elements.examSubject.value
        const instructor = e.target.elements.examInstructor.value
        const student = e.target.elements.student.value
        const room = e.target.elements.room.value

        const output = {
            type: 'exam',
            startTime: startTime,
            endTime: endTime,
            subject: subject,
            instructor: instructor,
            student: student,
            room: room,
        }
        socket.emit('new_event', output)
    })
    /* simForm.addEventListener('submit', e => {
        e.preventDefault();
        const startTime = e.target.elements.startTime.value
        const endTime = e.target.elements.endTime.value
        const title = e.target.elements.title.value
        const description = e.target.elements.description.value
        const instructor = e.target.elements.instructor.value
        const student = e.target.elements.student.value
        const sim = e.target.elements.sim.value

        const output = {
            type: 'sim',
            startTime: startTime,
            endTime: endTime,
            title: title,
            description: description,
            instructor: instructor,
            student: student,
            sim: sim,
        }
        socket.emit('new_event', output)
    })
    otherForm.addEventListener('submit', e => {
        e.preventDefault();
        const startTime = e.target.elements.startTime.value
        const endTime = e.target.elements.endTime.value
        const subject = e.target.elements.subject.value
        const instructor = e.target.elements.instructor.value
        const student = e.target.elements.student.value
        const room = e.target.elements.room.value
        const title = e.target.elements.title.value
        const description = e.target.elements.description.value
        const aircraft = e.target.elements.aircraft.value
        const sim = e.target.elements.sim.value

        const output = {
            type: 'other',
            startTime: startTime,
            endTime: endTime,
            title: title,
            description: description,
            instructor: instructor,
            student: student,
            room: room,
            subject: subject,
            aicraft: aircraft,
            sim: sim
        }
        socket.emit('new_event', output)
    }) */

}