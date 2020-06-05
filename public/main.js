const socket = io.connect('http://localhost:3000/');
socket.on('message', msg => { console.log(msg); })

// INITIAL DATA
const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const monthNamesShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

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
    console.log(input);

    /* const events = [
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
    ] */


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
        if (dayNumber === 1 && !!days[index - 1]) {
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
            hideNewEvent();
        } else {
            hideAvailability();
            showNewEvent();
        }
    })
    addEventForms();

    // Availability button
    document.getElementById('availability').addEventListener('click', () => {
        if (document.getElementById('availability-overlay').style.display === 'block') {
            hideAvailability();
        } else {
            hideNewEvent();
            showAvailability();
        }
    })
})

let eventsList = [];
function renderEvents(events) {
    eventsList = events;
    document.querySelectorAll('form[data-_id]').forEach(form => form.removeAttribute(`data-_id`))
    document.querySelectorAll('.event').forEach(event => { event.parentNode.removeChild(event) })
    loop1: for (const event of events) {
        const type = event.type;
        const startTime = new Date(event.startTime)
        const endTime = new Date(event.endTime)
        const startDay = startTime.getDate();
        const startMonth = startTime.getMonth();
        const endDay = endTime.getDate();
        const endMonth = endTime.getMonth();
        const selectDay = document.getElementById(`${startDay}-${monthNames[startMonth]}`);
        const startHours = startTime.getHours() >= 10 ? startTime.getHours() : `0${startTime.getHours()}`
        const startMinutes = startTime.getMinutes() >= 10 ? startTime.getMinutes() : `0${startTime.getMinutes()}`
        const endHours = endTime.getHours() >= 10 ? endTime.getHours() : `0${endTime.getHours()}`
        const endMinutes = endTime.getMinutes() >= 10 ? endTime.getMinutes() : `0${endTime.getMinutes()}`
        const newEvent = document.createElement('div')
        newEvent.setAttribute('data-_id', event._id)
        if (!document.getElementById(`${endDay}-${monthNames[endMonth]}`)) {
            continue loop1;
        }
        if (startDay === endDay && startMonth === endMonth) {
            newEvent.classList.add('event')
            newEvent.classList.add(type)
            newEvent.classList.add('no-select')
            // selectDay.addEventListener('click', createEvent)
        } else {
            newEvent.classList.add('event')
            newEvent.classList.add(type)
            newEvent.classList.add('no-select')
            if (selectDay.classList.contains('right')) {
                /* const selectNextDay = document.getElementById(`${startDay + 1}-${monthNames[startMonth]}`);
                newEvent.classList.add('two-days-split')
                newEvent.innerHTML = `1`
                const newEventDuplicate = JSON.parse(JSON.stringify(newEvent))
                var duplicate = true;
                selectNextDay.innerHTML = newEventDuplicate
                console.log(selectNextDay); */
            } else {
                // newEvent.classList.add('two-days')
            }
        }
        if (newEvent.classList.contains('notAvailable')) {
            newEvent.innerHTML = `${startHours}:${startMinutes} - ${endHours}:${endMinutes}: ${event.asset}`
        } else {
            newEvent.innerHTML = `${startHours}:${startMinutes}`
        }

        selectDay.appendChild(newEvent)
        // const endTime = `${ event.endTimeHours }: ${ event.endTimeMinutes } `
        const currentEvent = document.querySelector(`[data-_id="${event._id}"]`);
        // console.log(currentEvent);
        currentEvent.addEventListener('click', toggleEditEventOverlay.bind(event._id))
    }
}
socket.on('update_events', events => {
    hideNewEvent();
    hideAvailability();
    hideEditEventOverlay();
    renderEvents(events)
})

// NEW EVENT FORM
function showNewEvent() {
    document.getElementById('overlay').style.display = "block";
}
function hideNewEvent() {
    document.getElementById('overlay').style.display = "none";
}
function addEventForms() {
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
        console.log(e.target.elements);
        const startTime = e.target.elements.flightStartTime.value
        const endTime = e.target.elements.flightEndTime.value
        const instructor = e.target.elements.flightInstructor.value
        const student = e.target.elements.flightStudent.value
        const aircraft = e.target.elements.aircraft.value

        calendarParams.clientDate = new Date()

        const output = {
            type: 'flight',
            startTime,
            endTime,
            instructor,
            student,
            aircraft,
            clientDate: calendarParams.clientDate,
            weekStartDay: calendarParams.weekStartDay
        }
        socket.emit('new_event', output)
    })
    classForm.addEventListener('submit', e => {
        e.preventDefault();
        const startTime = e.target.elements.classStartTime.value
        const endTime = e.target.elements.classEndTime.value
        const subject = e.target.elements.classSubject.value
        const instructor = e.target.elements.classInstructor.value
        const student = e.target.elements.classStudent.value
        const room = e.target.elements.classRoom.value

        calendarParams.clientDate = new Date()

        const output = {
            type: 'class',
            startTime,
            endTime,
            subject,
            instructor,
            student,
            room,
            clientDate: calendarParams.clientDate,
            weekStartDay: calendarParams.weekStartDay
        }
        socket.emit('new_event', output)
    })
    examForm.addEventListener('submit', e => {
        e.preventDefault();
        const startTime = e.target.elements.examStartTime.value
        const endTime = e.target.elements.examEndTime.value
        const subject = e.target.elements.examSubject.value
        const instructor = e.target.elements.examInstructor.value
        const student = e.target.elements.examStudent.value
        const room = e.target.elements.examRoom.value

        calendarParams.clientDate = new Date()

        const output = {
            type: 'exam',
            startTime,
            endTime,
            subject,
            instructor,
            student,
            room,
            clientDate: calendarParams.clientDate,
            weekStartDay: calendarParams.weekStartDay
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

// EDIT EVENTS FORMS
function showEditEventOverlay(_id) {
    _id = String(_id)
    // AUTO FILL FIELDS WITH EVENT DATA:
    loop1: for (const event of eventsList) {
        if (event._id === _id) {
            document.getElementById('edit-event-overlay').style.display = "block";
            const type = event.type === 'notAvailable' ? 'availability' : event.type
            const form = document.getElementById(`edit-${type}-form`)
            document.getElementById('edit-event-overlay').querySelectorAll('form').forEach(form => {
                if (form.getAttribute('id') === `edit-${type}-form`) {
                    form.style.display = "block";
                    form.setAttribute('data-_id', _id)
                } else {
                    form.style.display = "none";
                }
            })
            const startDate = new Date(event.startTime)
            const endDate = new Date(event.endTime)
            /* const startYear = new Date(event.startTime).getFullYear();
            let startMonth = new Date(event.startTime).getMonth();
            let startDay = new Date(event.startTime).getDate();
            const endYear = new Date(event.endTime).getFullYear();
            let endMonth = new Date(event.endTime).getMonth();
            let endDay = new Date(event.endTime).getDate(); */
            /* if (startMonth < 10) {
                startMonth = `0${startMonth}`
            }
            if (startDay < 10) {
                startDay = `0${startDay}`
            }
            if (endMonth < 10) {
                endMonth = `0${endMonth}`
            }
            if (endDay < 10) {
                endDay = `0${endDay}`
            } */

            const timeZoneOffset = startDate.getTimezoneOffset() * 60000; //offset in milliseconds
            const localISOStartTime = (new Date(startDate - timeZoneOffset)).toISOString().substring(0, 19);
            const localISOEndTime = (new Date(startDate - timeZoneOffset)).toISOString().substring(0, 19);
            // console.log(localISOStartTime);
            // console.log(localISOEndTime);
            form.querySelector(`#${type}StartTime`).setAttribute('value', localISOStartTime)
            form.querySelector(`#${type}EndTime`).setAttribute('value', localISOEndTime)
            form.querySelectorAll('option').forEach(option => {
                option.removeAttribute('selected')
            })
            if (type === 'availability') {
                form.querySelector(`#asset`).querySelectorAll('option').forEach(option => {
                    if (option.innerHTML === event.asset) {
                        option.setAttribute('selected', "")
                    }
                })
            } else if (type === 'flight') {
                form.querySelector(`#flightInstructor`).querySelectorAll('option').forEach(option => {
                    if (option.innerHTML === event.instructor) {
                        option.setAttribute('selected', "")
                    }
                })
                form.querySelector(`#flightStudent`).querySelectorAll('option').forEach(option => {
                    if (option.innerHTML === event.student) {
                        option.setAttribute('selected', "")
                    }
                })
                form.querySelector(`#aircraft`).querySelectorAll('option').forEach(option => {
                    if (option.innerHTML === event.aircraft) {
                        option.setAttribute('selected', "")
                    }
                })
            }
            break loop1;
        }
    }
}
function hideEditEventOverlay() {
    document.getElementById('edit-event-overlay').style.display = "none";
}
function toggleEditEventOverlay() {
    if (document.getElementById('edit-event-overlay').style.display === "block") {
        hideEditEventOverlay();
    } else {
        showEditEventOverlay(this);
    }
}
function editEvent() {
    this // _id
}
const editAvailabilityForm = document.getElementById('edit-availability-form')
const editFlightForm = document.getElementById('edit-flight-form')
const editClassForm = document.getElementById('edit-class-form')
const editExamForm = document.getElementById('edit-exam-form')
editAvailabilityForm.addEventListener('submit', e => {
    e.preventDefault();
    console.log(e.target.elements);
    const _id = e.target.dataset._id
    const startTime = e.target.elements.availabilityStartTime.value
    const endTime = e.target.elements.availabilityEndTime.value
    const asset = e.target.elements.asset.value
    calendarParams.clientDate = new Date()
    const output = {
        _id,
        type: 'notAvailable',
        startTime,
        endTime,
        asset,
        clientDate: calendarParams.clientDate,
        weekStartDay: calendarParams.weekStartDay
    }
    socket.emit('edit_event', output)
})
editFlightForm.addEventListener('submit', e => {
    e.preventDefault();
    console.log(e.target.elements);
    const _id = e.target.dataset._id
    const startTime = e.target.elements.flightStartTime.value
    const endTime = e.target.elements.flightEndTime.value
    const aircraft = e.target.elements.aircraft.value
    const student = e.target.elements.flightStudent.value
    const instructor = e.target.elements.flightInstructor.value
    calendarParams.clientDate = new Date()
    const output = {
        _id,
        type: 'flight',
        startTime,
        endTime,
        aircraft,
        student,
        instructor,
        clientDate: calendarParams.clientDate,
        weekStartDay: calendarParams.weekStartDay
    }
    socket.emit('edit_event', output)
})
editClassForm.addEventListener('submit', e => {
    e.preventDefault();
    console.log(e.target.elements);
    const _id = e.target.dataset._id
    const startTime = e.target.elements.classStartTime.value
    const endTime = e.target.elements.classEndTime.value
    const student = e.target.elements.classStudent.value
    const instructor = e.target.elements.classInstructor.value
    const subject = e.target.elements.classSubject.value
    const room = e.target.elements.classRoom.value
    calendarParams.clientDate = new Date()
    const output = {
        _id,
        type: 'class',
        startTime,
        endTime,
        subject,
        room,
        student,
        instructor,
        clientDate: calendarParams.clientDate,
        weekStartDay: calendarParams.weekStartDay
    }
    socket.emit('edit_event', output)
})
editExamForm.addEventListener('submit', e => {
    e.preventDefault();
    console.log(e.target.elements);
    const _id = e.target.dataset._id
    const startTime = e.target.elements.examStartTime.value
    const endTime = e.target.elements.examEndTime.value
    const student = e.target.elements.examStudent.value
    const instructor = e.target.elements.examInstructor.value
    const subject = e.target.elements.examSubject.value
    const room = e.target.elements.examRoom.value
    calendarParams.clientDate = new Date()
    const output = {
        _id,
        type: 'exam',
        startTime,
        endTime,
        subject,
        room,
        student,
        instructor,
        clientDate: calendarParams.clientDate,
        weekStartDay: calendarParams.weekStartDay
    }
    socket.emit('edit_event', output)
})

// AVAILABILITY FORM
function showAvailability() {
    document.getElementById('availability-overlay').style.display = "block";
}
function hideAvailability() {
    document.getElementById('availability-overlay').style.display = "none";
}
const availabilityForm = document.getElementById('availability-form')
availabilityForm.addEventListener('submit', e => {
    e.preventDefault();
    console.log(e.target.elements);
    const startTime = e.target.elements.availabilityStartTime.value
    const endTime = e.target.elements.availabilityEndTime.value
    const asset = e.target.elements.asset.value

    calendarParams.clientDate = new Date()

    const output = {
        type: 'notAvailable',
        startTime,
        endTime,
        asset,
        clientDate: calendarParams.clientDate,
        weekStartDay: calendarParams.weekStartDay
    }
    socket.emit('new_event', output)
})