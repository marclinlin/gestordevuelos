const socket = io.connect('http://localhost:3000/');
socket.on('message', msg => { console.log(msg); })


/* INITIAL DATA */

// CUSTOM
const labels = ['availability', 'flight', 'class', 'exam'] // Event types
const instructors = ['Rubén Velázquez', 'Jaime Martín', 'Tomás Losa', 'Javier Arconada']
const students = ['Marcos Lin', 'David Verdeguer', 'Ahmed al-Kindi', 'Kris Normandale']
const aircraftList = ['EC-NAQ', 'EC-NEM', 'EC-NFG', 'EC-LLB']
const subjects = ['Principles of flight', 'Meteorology', 'Mass & Balance', 'Performance', 'Flight Planning and Monitoring']
const rooms = ['Room 1', 'Room 2', 'Sim room', 'Ops room']
const formFields = [];

// FIXED
const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const monthNamesShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const instructorObjects = []
for (instructor of instructors) {
    instructorObjects.push({
        type: 'instructor',
        name: instructor
    })
}
const studentObjects = []
for (student of students) {
    studentObjects.push({
        type: 'student',
        name: student
    })
}
const aircraftObjects = []
for (aircraft of aircraftList) {
    aircraftObjects.push({
        type: 'aircraft',
        name: aircraft
    })
}
const roomObjects = []
for (room of rooms) {
    roomObjects.push({
        type: 'room',
        name: room
    })
}
const assets = instructorObjects.concat(studentObjects).concat(aircraftObjects).concat(roomObjects)


/* GET MONTH CALENDAR */
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
        hideEditEventOverlay();
        if (document.getElementById('new-event-overlay').style.display === 'block') {
            hideNewEvent();
        } else {
            showNewEvent();
        }
    })
    addEventForm();

    // Availability button
    /* document.getElementById('availability').addEventListener('click', () => {
        if (document.getElementById('availability-overlay').style.display === 'block') {
        } else {
            hideNewEvent();
        }
    }) */
})

let eventsList = [];
function renderEvents(events) {
    eventsList = events;
    document.querySelectorAll('form[data-_id]').forEach(form => form.removeAttribute(`data-_id`)) // NEEDS FIX??
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
            newEvent.innerHTML = `${startHours}:${startMinutes} - ${endHours}:${endMinutes}: ${event.asset.name}`
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
    hideEditEventOverlay();
    renderEvents(events)
})

// NEW EVENT FORM
const addForm = document.getElementById('new-event-form')
function showNewEvent() {
    document.getElementById('new-event-overlay').style.display = "block";
}
function hideNewEvent() {
    document.getElementById('new-event-overlay').style.display = "none";
}
function addEventForm() {
    editForm.querySelectorAll('div').forEach(node => { node.parentNode.removeChild(node) })
    editForm.querySelectorAll('input').forEach(node => { node.parentNode.removeChild(node) })
    /* ADD EVENT FORMS */
    const radios = document.getElementsByName('type-radio');
    let type = undefined;

    // Show forms
    for (const radio of radios) {
        radio.onclick = function () {
            type = this.value;
            addForm.querySelectorAll('div.form-field').forEach(field => {
                if (!field.querySelector('#startTime') && !field.querySelector('#endTime')) {
                    field.parentNode.removeChild(field)
                }
            })
            addForm.querySelectorAll('input[type="submit"]').forEach(node => { node.parentNode.removeChild(node) })
            const overlay = document.getElementById('new-event-overlay');

            if (overlay.classList[0] == 'before-click') {
                overlay.classList.remove('before-click')
                overlay.classList.add('after-click')
            }

            for (const label of labels) {
                const labelElement = document.getElementById(`${label}-label`)
                if (type === label) {
                    labelElement.classList.add('active')
                } else {
                    labelElement.classList.remove('active')
                }
            }

            if (!addForm.querySelector('#startTime') && !addForm.querySelector('#endTime')) {
                // Start time
                const newFieldST = document.createElement('div')
                newFieldST.classList.add('form-field')
                newFieldST.innerHTML = `
                <div class="label">Start time</div>
                <input type="datetime-local" id="startTime" name="startTime">
                `;
                addForm.appendChild(newFieldST)

                // End time
                const newFieldET = document.createElement('div')
                newFieldET.classList.add('form-field')
                newFieldET.innerHTML = `
                <div class="label">End time</div>
                <input type="datetime-local" id="endTime" name="endTime">
                `;
                addForm.appendChild(newFieldET)
            }

            if (type === 'availability') {
                // Asset option
                const newField1 = document.createElement('div')
                newField1.classList.add('form-field')
                newField1.innerHTML = `
                <div class="label">Asset:</div>
                <div class="input size50">
                    <select id="asset" class="styled" multiple>
                    </select>
                </div>
                `;
                addForm.appendChild(newField1)
                const assetInput = document.getElementById('asset');
                assetInput.innerHTML = `<option selected>Select asset</option>`
                for (const asset of assets) {
                    const newOption = document.createElement('option')
                    newOption.innerHTML = asset.name;
                    assetInput.appendChild(newOption)
                }
            } else if (type === 'flight') {
                // Instructor
                const newField1 = document.createElement('div')
                newField1.classList.add('form-field')
                newField1.innerHTML = `
                <div class="label">Instructor:</div>
                <div class="input size50">
                    <select id="instructor" class="styled" multiple>
                    </select>
                </div>
                `;
                addForm.appendChild(newField1)
                const instructorInput = document.getElementById('instructor');
                instructorInput.innerHTML = `<option selected>Select instructor</option>`
                for (const instructor of instructors) {
                    const newOption = document.createElement('option')
                    newOption.innerHTML = instructor;
                    instructorInput.appendChild(newOption)
                }

                // Student
                const newField2 = document.createElement('div')
                newField2.classList.add('form-field')
                newField2.innerHTML = `
                <div class="label">Student:</div>
                <div class="input size50">
                    <select id="student" class="styled" multiple>
                    </select>
                </div>
                `;
                addForm.appendChild(newField2)
                const studentInput = document.getElementById('student');
                studentInput.innerHTML = `<option selected>Select student</option>`
                for (const student of students) {
                    const newOption = document.createElement('option')
                    newOption.innerHTML = student;
                    studentInput.appendChild(newOption)
                }

                // Aircraft
                const newField3 = document.createElement('div')
                newField3.classList.add('form-field')
                newField3.innerHTML = `
                <div class="label">Aircraft:</div>
                <div class="input size50">
                    <select id="aircraft" class="styled" multiple>
                    </select>
                </div>
                `;
                addForm.appendChild(newField3)
                const aircraftInput = document.getElementById('aircraft');
                aircraftInput.innerHTML = `<option selected>Select aircraft</option>`
                for (const aircraft of aircraftList) {
                    const newOption = document.createElement('option')
                    newOption.innerHTML = aircraft;
                    aircraftInput.appendChild(newOption)
                }
            } else if (type === 'class' || type === 'exam') {
                // Instructor
                const newField1 = document.createElement('div')
                newField1.classList.add('form-field')
                newField1.innerHTML = `
                <div class="label">Instructor:</div>
                <div class="input size50">
                    <select id="instructor" class="styled" multiple>
                    </select>
                </div>
                `;
                addForm.appendChild(newField1)
                const instructorInput = document.getElementById('instructor');
                instructorInput.innerHTML = `<option selected>Select instructor</option>`
                for (const instructor of instructors) {
                    const newOption = document.createElement('option')
                    newOption.innerHTML = instructor;
                    instructorInput.appendChild(newOption)
                }

                // Student
                const newField2 = document.createElement('div')
                newField2.classList.add('form-field')
                newField2.innerHTML = `
                <div class="label">Student:</div>
                <div class="input size50">
                    <select id="student" class="styled" multiple>
                    </select>
                </div>
                `;
                addForm.appendChild(newField2)
                const studentInput = document.getElementById('student');
                studentInput.innerHTML = `<option selected>Select student</option>`
                for (const student of students) {
                    const newOption = document.createElement('option')
                    newOption.innerHTML = student;
                    studentInput.appendChild(newOption)
                }

                // Subject
                const newField3 = document.createElement('div')
                newField3.classList.add('form-field')
                newField3.innerHTML = `
                <div class="label">Subject:</div>
                <div class="input size50">
                    <select id="subject" class="styled" multiple>
                    </select>
                </div>
                `;
                addForm.appendChild(newField3)
                const subjectInput = document.getElementById('subject');
                subjectInput.innerHTML = `<option selected>Select subject</option>`
                for (const subject of subjects) {
                    const newOption = document.createElement('option')
                    newOption.innerHTML = subject;
                    subjectInput.appendChild(newOption)
                }

                // Room
                const newField4 = document.createElement('div')
                newField4.classList.add('form-field')
                newField4.innerHTML = `
                <div class="label">Room:</div>
                <div class="input size50">
                    <select id="room" class="styled" multiple>
                    </select>
                </div>
                `;
                addForm.appendChild(newField4)
                const roomInput = document.getElementById('room');
                roomInput.innerHTML = `<option selected>Select room</option>`
                for (const room of rooms) {
                    const newOption = document.createElement('option')
                    newOption.innerHTML = room;
                    roomInput.appendChild(newOption)
                }
            }
            const newSubmitButton = document.createElement('input')
            newSubmitButton.setAttribute('type', 'submit')
            newSubmitButton.setAttribute('value', 'Add')
            addForm.appendChild(newSubmitButton)
            addForm.style.display = 'block';
        }
    }

    /* // SIM FORM
        const output = {
            type: 'sim',
            startTime: startTime,
            endTime: endTime,
            title: title,
            description: description,
            instructor: instructor,
            student: student,
            sim: sim
        }

    // OTHER FORM
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
        } */
    addForm.addEventListener('submit', e => {
        e.preventDefault();
        const startTime = e.target.elements.startTime.value
        const endTime = e.target.elements.endTime.value
        calendarParams.clientDate = new Date()
        const output = {
            type,
            startTime,
            endTime,
            clientDate: calendarParams.clientDate,
            weekStartDay: calendarParams.weekStartDay
        }

        if (type === 'availability') {
            let assetType = undefined;
            if (instructors.includes(e.target.elements.asset.value)) {
                assetType = 'instructor'
            } else if (students.includes(e.target.elements.asset.value)) {
                assetType = 'student'
            } else if (aircraftList.includes(e.target.elements.asset.value)) {
                assetType = 'aircraft'
            } else if (rooms.includes(e.target.elements.asset.value)) {
                assetType = 'room'
            }
            output.type = 'notAvailable'
            output.asset = {
                name: e.target.elements.asset.value,
                type: assetType
            }
        } else if (type === 'flight') {
            output.instructor = e.target.elements.instructor.value
            output.student = e.target.elements.student.value
            output.aircraft = e.target.elements.aircraft.value
        } else if (type === 'class' || type === 'exam') {
            output.instructor = e.target.elements.instructor.value
            output.student = e.target.elements.student.value
            output.subject = e.target.elements.subject.value
            output.room = e.target.elements.room.value
        }
        console.log(output);
        socket.emit('new_event', output)
    })
}

// EDIT EVENTS FORMS
const editForm = document.getElementById('edit-event-form')
function showEditEventOverlay(_id) {
    hideNewEvent();
    addForm.querySelectorAll('div').forEach(node => { node.parentNode.removeChild(node) })
    addForm.querySelectorAll('input').forEach(node => { node.parentNode.removeChild(node) })
    const newEventOverlay = document.getElementById('new-event-overlay')
    newEventOverlay.querySelectorAll('label.active').forEach(label => { label.classList.remove('active') })
    if (newEventOverlay.classList.contains('after-click')) {
        newEventOverlay.classList.remove('after-click')
        newEventOverlay.classList.add('before-click')
    }
    /* EDIT EVENT FORM */
    editForm.setAttribute('data-_id', _id)

    // Show forms
    editForm.querySelectorAll('div.form-field').forEach(field => { field.parentNode.removeChild(field) })
    editForm.querySelectorAll('input[type="submit"]').forEach(node => { node.parentNode.removeChild(node); })
    editForm.querySelectorAll('input[type="button"]').forEach(node => { node.parentNode.removeChild(node); })
    const type = document.querySelector(`div[data-_id="${_id}"]`).classList[1] === 'notAvailable' ? 'availability' : document.querySelector(`div[data-_id="${_id}"]`).classList[1]
    editForm.setAttribute('data-type', type)

    if (!editForm.querySelector('#startTime') && !editForm.querySelector('#endTime')) {
        // Start time
        const newFieldST = document.createElement('div')
        newFieldST.classList.add('form-field')
        newFieldST.innerHTML = `
        <div class="label">Start time</div>
        <input type="datetime-local" id="startTime" name="startTime">
        `;
        editForm.appendChild(newFieldST)

        // End time
        const newFieldET = document.createElement('div')
        newFieldET.classList.add('form-field')
        newFieldET.innerHTML = `
        <div class="label">End time</div>
        <input type="datetime-local" id="endTime" name="endTime">
        `;
        editForm.appendChild(newFieldET)
    }

    if (type === 'availability') {
        // Asset option
        const newField1 = document.createElement('div')
        newField1.classList.add('form-field')
        newField1.innerHTML = `
        <div class="label">Asset:</div>
        <div class="input size50">
            <select id="asset" class="styled" multiple>
            </select>
        </div>
        `;
        editForm.appendChild(newField1)
        const assetInput = document.getElementById('asset');
        for (const asset of assets) {
            const newOption = document.createElement('option')
            newOption.innerHTML = asset.name;
            assetInput.appendChild(newOption)
        }
    } else if (type === 'flight') {
        // Instructor
        const newField1 = document.createElement('div')
        newField1.classList.add('form-field')
        newField1.innerHTML = `
        <div class="label">Instructor:</div>
        <div class="input size50">
            <select id="instructor" class="styled" multiple>
            </select>
        </div>
        `;
        editForm.appendChild(newField1)
        const instructorInput = document.getElementById('instructor');
        for (const instructor of instructors) {
            const newOption = document.createElement('option')
            newOption.innerHTML = instructor;
            instructorInput.appendChild(newOption)
        }

        // Student
        const newField2 = document.createElement('div')
        newField2.classList.add('form-field')
        newField2.innerHTML = `
        <div class="label">Student:</div>
        <div class="input size50">
            <select id="student" class="styled" multiple>
            </select>
        </div>
        `;
        editForm.appendChild(newField2)
        const studentInput = document.getElementById('student');
        for (const student of students) {
            const newOption = document.createElement('option')
            newOption.innerHTML = student;
            studentInput.appendChild(newOption)
        }

        // Aircraft
        const newField3 = document.createElement('div')
        newField3.classList.add('form-field')
        newField3.innerHTML = `
        <div class="label">Aircraft:</div>
        <div class="input size50">
            <select id="aircraft" class="styled" multiple>
            </select>
        </div>
        `;
        editForm.appendChild(newField3)
        const aircraftInput = document.getElementById('aircraft');
        for (const aircraft of aircraftList) {
            const newOption = document.createElement('option')
            newOption.innerHTML = aircraft;
            aircraftInput.appendChild(newOption)
        }
    } else if (type === 'class' || type === 'exam') {
        // Instructor
        const newField1 = document.createElement('div')
        newField1.classList.add('form-field')
        newField1.innerHTML = `
        <div class="label">Instructor:</div>
        <div class="input size50">
            <select id="instructor" class="styled" multiple>
            </select>
        </div>
        `;
        editForm.appendChild(newField1)
        const instructorInput = document.getElementById('instructor');
        for (const instructor of instructors) {
            const newOption = document.createElement('option')
            newOption.innerHTML = instructor;
            instructorInput.appendChild(newOption)
        }

        // Student
        const newField2 = document.createElement('div')
        newField2.classList.add('form-field')
        newField2.innerHTML = `
        <div class="label">Student:</div>
        <div class="input size50">
            <select id="student" class="styled" multiple>
            </select>
        </div>
        `;
        editForm.appendChild(newField2)
        const studentInput = document.getElementById('student');
        for (const student of students) {
            const newOption = document.createElement('option')
            newOption.innerHTML = student;
            studentInput.appendChild(newOption)
        }

        // Subject
        const newField3 = document.createElement('div')
        newField3.classList.add('form-field')
        newField3.innerHTML = `
        <div class="label">Subject:</div>
        <div class="input size50">
            <select id="subject" class="styled" multiple>
            </select>
        </div>
        `;
        editForm.appendChild(newField3)
        const subjectInput = document.getElementById('subject');
        for (const subject of subjects) {
            const newOption = document.createElement('option')
            newOption.innerHTML = subject;
            subjectInput.appendChild(newOption)
        }

        // Room
        const newField4 = document.createElement('div')
        newField4.classList.add('form-field')
        newField4.innerHTML = `
        <div class="label">Room:</div>
        <div class="input size50">
            <select id="room" class="styled" multiple>
            </select>
        </div>
        `;
        editForm.appendChild(newField4)
        const roomInput = document.getElementById('room');
        for (const room of rooms) {
            const newOption = document.createElement('option')
            newOption.innerHTML = room;
            roomInput.appendChild(newOption)
        }
    }
    const newSubmitButton = document.createElement('input')
    newSubmitButton.setAttribute('type', 'submit')
    newSubmitButton.setAttribute('value', 'Save')
    const newDeleteButton = document.createElement('input')
    newDeleteButton.setAttribute('type', 'button')
    newDeleteButton.setAttribute('value', 'Delete')
    const newDiscardButton = document.createElement('input')
    newDiscardButton.setAttribute('type', 'button')
    newDiscardButton.setAttribute('value', 'Discard')
    editForm.appendChild(newSubmitButton)
    editForm.appendChild(newDeleteButton)
    editForm.appendChild(newDiscardButton)
    editForm.querySelector('input[value="Delete"]').addEventListener('click', e => {
        e.preventDefault();
        calendarParams.clientDate = new Date()
        const outputEvent = {
            _id,
            clientDate: calendarParams.clientDate,
            weekStartDay: calendarParams.weekStartDay
        }
        // console.log(`Deleting event ${outputEvent._id}`);
        socket.emit('delete_event', outputEvent)
    })
    editForm.querySelector('input[value="Discard"]').addEventListener('click', e => {
        e.preventDefault();
        hideEditEventOverlay();
    })

    // AUTO FILL FIELDS WITH EVENT DATA:
    loop1: for (const event of eventsList) {
        if (event._id === _id) {
            const type = event.type === 'notAvailable' ? 'availability' : event.type
            const startDate = new Date(event.startTime)
            const endDate = new Date(event.endTime)
            const timeZoneOffset = startDate.getTimezoneOffset() * 60000; //offset in milliseconds
            const localISOStartTime = (new Date(startDate - timeZoneOffset)).toISOString().substring(0, 19);
            const localISOEndTime = (new Date(endDate - timeZoneOffset)).toISOString().substring(0, 19);
            // console.log(localISOStartTime);
            // console.log(localISOEndTime);
            editForm.querySelector(`#startTime`).setAttribute('value', localISOStartTime)
            editForm.querySelector(`#endTime`).setAttribute('value', localISOEndTime)
            editForm.querySelectorAll('option').forEach(option => {
                option.removeAttribute('selected')
            })
            if (type === 'availability') {
                editForm.querySelector(`#asset`).querySelectorAll('option').forEach(option => {
                    if (option.innerHTML === event.asset.name) {
                        option.setAttribute('selected', "")
                    }
                })
            } else if (type === 'flight') {
                editForm.querySelector(`#instructor`).querySelectorAll('option').forEach(option => {
                    if (option.innerHTML === event.instructor) {
                        option.setAttribute('selected', "")
                    }
                })
                editForm.querySelector(`#student`).querySelectorAll('option').forEach(option => {
                    if (option.innerHTML === event.student) {
                        option.setAttribute('selected', "")
                    }
                })
                editForm.querySelector(`#aircraft`).querySelectorAll('option').forEach(option => {
                    if (option.innerHTML === event.aircraft) {
                        option.setAttribute('selected', "")
                    }
                })
            } else if (type === 'class' || type === 'exam') {
                editForm.querySelector(`#instructor`).querySelectorAll('option').forEach(option => {
                    if (option.innerHTML === event.instructor) {
                        option.setAttribute('selected', "")
                    }
                })
                editForm.querySelector(`#student`).querySelectorAll('option').forEach(option => {
                    if (option.innerHTML === event.student) {
                        option.setAttribute('selected', "")
                    }
                })
                editForm.querySelector(`#subject`).querySelectorAll('option').forEach(option => {
                    if (option.innerHTML === event.subject) {
                        option.setAttribute('selected', "")
                    }
                })
                editForm.querySelector(`#room`).querySelectorAll('option').forEach(option => {
                    if (option.innerHTML === event.room) {
                        option.setAttribute('selected', "")
                    }
                })
            }
            break loop1;
        }
    }
    editForm.style.display = 'block';
    document.getElementById('edit-event-overlay').style.display = "block";
}
function hideEditEventOverlay() {
    document.getElementById('edit-event-overlay').style.display = "none";
}
function toggleEditEventOverlay() {
    const _id = String(this);
    if (document.getElementById('edit-event-overlay').style.display === "block") {
        if (editForm.dataset._id === _id) {
            hideEditEventOverlay();
        } else {
            showEditEventOverlay(_id);
        }
    } else {
        showEditEventOverlay(_id);
    }
}
editForm.addEventListener('submit', e => {
    e.preventDefault();
    const _id = e.target.dataset._id
    const type = e.target.dataset.type
    const startTime = e.target.elements.startTime.value
    const endTime = e.target.elements.endTime.value
    calendarParams.clientDate = new Date()
    const output = {
        _id,
        type,
        startTime,
        endTime,
        clientDate: calendarParams.clientDate,
        weekStartDay: calendarParams.weekStartDay
    }
    if (type === 'availability') {
        output.type = 'notAvailable'
        let type = undefined;
        if (instructors.includes(e.target.elements.asset.value)) {
            type = 'instructor'
        } else if (students.includes(e.target.elements.asset.value)) {
            type = 'student'
        } else if (aircraftList.includes(e.target.elements.asset.value)) {
            type = 'aircraft'
        } else if (rooms.includes(e.target.elements.asset.value)) {
            type = 'room'
        }
        output.asset = {
            type,
            name: e.target.elements.asset.value
        }
    } else if (type === 'flight') {
        output.instructor = e.target.elements.instructor.value
        output.student = e.target.elements.student.value
        output.aircraft = e.target.elements.aircraft.value
    } else if (type === 'class' || type === 'exam') {
        output.instructor = e.target.elements.instructor.value
        output.student = e.target.elements.student.value
        output.subject = e.target.elements.subject.value
        output.room = e.target.elements.room.value
    }
    // console.log(output);
    socket.emit('edit_event', output)
})