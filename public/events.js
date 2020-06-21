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

const calendarParams = {
    clientDate: new Date(),
    weekStartDay: 'Monday'
}

// ADD EVENT
function openAddEvent() {
    document.getElementById('new-event-overlay').style.display = 'block'
    addEventButton.removeEventListener('click', openAddEvent)
    addEventButton.addEventListener('click', closeAddEvent)
}
function closeAddEvent() {
    document.getElementById('new-event-overlay').style.display = 'none'
    addEventButton.removeEventListener('click', closeAddEvent)
    addEventButton.addEventListener('click', openAddEvent)
}
const addEventButton = document.getElementById('new-event-button')
addEventButton.addEventListener('click', openAddEvent)
const newEventForm = document.getElementById('new-event-form')
/* const closeAddEventButton = document.querySelector('.close-addEvent')
closeAddEventButton.addEventListener('click', closeAddEvent) */


function addEventForm() {
    /* editForm.querySelectorAll('div').forEach(node => { node.parentNode.removeChild(node) })
    editForm.querySelectorAll('input').forEach(node => { node.parentNode.removeChild(node) }) */
    /* ADD EVENT FORMS */
    const radios = document.getElementsByName('type-radio');
    let type = undefined;

    // Show forms
    for (const radio of radios) {
        radio.onclick = function () {
            type = this.value;
            newEventForm.querySelectorAll('div.form-field').forEach(field => {
                if (!field.querySelector('#startTime') && !field.querySelector('#endTime')) {
                    field.parentNode.removeChild(field)
                }
            })
            newEventForm.querySelectorAll('input[type="submit"]').forEach(node => { node.parentNode.removeChild(node) })
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

            if (!newEventForm.querySelector('#startTime') && !newEventForm.querySelector('#endTime')) {
                // Start time
                const newFieldST = document.createElement('div')
                newFieldST.classList.add('form-field')
                newFieldST.innerHTML = `
                <div class="label">Start time</div>
                <input type="datetime-local" id="startTime" name="startTime">
                `;
                newEventForm.appendChild(newFieldST)

                // End time
                const newFieldET = document.createElement('div')
                newFieldET.classList.add('form-field')
                newFieldET.innerHTML = `
                <div class="label">End time</div>
                <input type="datetime-local" id="endTime" name="endTime">
                `;
                newEventForm.appendChild(newFieldET)
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
                newEventForm.appendChild(newField1)
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
                newEventForm.appendChild(newField1)
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
                newEventForm.appendChild(newField2)
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
                newEventForm.appendChild(newField3)
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
                newEventForm.appendChild(newField1)
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
                newEventForm.appendChild(newField2)
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
                newEventForm.appendChild(newField3)
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
                newEventForm.appendChild(newField4)
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
            newEventForm.appendChild(newSubmitButton)
            newEventForm.style.display = 'block';
        }
    }

    newEventForm.addEventListener('submit', e => {
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
addEventForm();


















// EDIT/DELETE EVENT
function editEvent() {
    let id = this.id;
    let _id = this._id;
    document.getElementById(id).querySelectorAll('div').forEach(field => {
        function saveEventFunction() {
            const outputevent = {}
            document.getElementById(this).querySelectorAll('div').forEach(field => {
                field.firstElementChild.setAttribute('contenteditable', false)
                const className = field.classList[0];
                if (field.className !== 'manage-icons' && field.className !== 'last-connection' && field.className !== 'role') {
                    if (field.className === 'id') {
                        outputevent['id'] = field.firstElementChild.innerHTML
                    } else {
                        outputevent[className] = field.firstElementChild.innerHTML
                    }
                } else if (field.className === 'role') {
                    const newRole = field.firstElementChild.elements.role.value
                    outputevent['role'] = newRole
                    field.querySelectorAll('form').forEach(form => { form.parentNode.removeChild(form) })
                    field.innerHTML = `<span>${newRole}</span>`
                }
            })
            const saveEventButton = field.querySelector('.save-event')
            saveEventButton.parentNode.removeChild(saveeventButton)
            const editEventButton = document.createElement('a')
            editEventButton.setAttribute('href', '#')
            editEventButton.classList.add('edit-event')
            editEventButton.innerHTML = 'Edit'
            const currentSeparator = document.getElementById(id).querySelector('.manage-icons').querySelectorAll('span')[0]
            field.insertBefore(editEventButton, currentSeparator)
            field.querySelector('.edit-event').addEventListener('click', editEvent.bind(id));
            outputEvent['_id'] = _id
            socket.emit('edit_event', outputEvent)
            console.log(`Saving event ${id}:`);
            console.log(outputEvent);
        }
        function preventLineBreak(e) {
            if (e.keyCode == 13) { // KEY ENTER
                e.preventDefault();
            }
        }
        if (!field.classList.contains('manage-icons') && !field.classList.contains('last-connection') && !field.classList.contains('role')) {
            field.firstChild.setAttribute('contenteditable', true)
            field.addEventListener('keydown', preventLineBreak)
        } else if (field.classList.contains('manage-icons')) {
            const editEventButton = field.querySelector('.edit-event')
            editEventButton.parentNode.removeChild(editEventButton)
            const saveEventButton = document.createElement('a')
            saveEventButton.setAttribute('href', '#')
            saveEventButton.classList.add('save-event')
            saveEventButton.innerHTML = 'Save'
            const currentSeparator = document.getElementById(id).querySelector('.manage-icons').querySelectorAll('span')[0]
            field.insertBefore(saveEventButton, currentSeparator)
            field.querySelector('.save-event').addEventListener('click', saveEventFunction.bind(id));
        } else if (field.classList.contains('last-connection')) {
            // 
        } else if (field.classList.contains('role')) {
            const currentRole = field.firstElementChild.innerHTML
            field.querySelectorAll('span').forEach(element => element.parentNode.removeChild(element))
            const adminInnerHTML = `
            <form>
            <select id="role" multiple>
            <option selected>admin</option>
            <option>instructor</option>
            <option>student</option>
            </select>
            </form>`
            const instructorInnerHTML = `
            <form>
            <select id="role" multiple>
            <option>admin</option>
            <option selected>instructor</option>
            <option>student</option>
            </select>
            </form>`
            const studentInnerHTML = `
            <form>
            <select id="role" multiple>
            <option>admin</option>
            <option>instructor</option>
            <option selected>student</option>
            </select>
            </form>`
            if (currentRole === 'admin') {
                field.innerHTML = adminInnerHTML
            } else if (currentRole === 'instructor') {
                field.innerHTML = instructorInnerHTML
            } else if (currentRole === 'student') {
                field.innerHTML = studentInnerHTML
            }
        }
    })
    console.log(`Editing event ${id}`);
}
function deleteEvent() {
    socket.emit('delete_event', this)
    console.log(`Deleting event ${this._id}`);
}

// INIT PAGE
let events = undefined;
socket.emit('get_events', calendarParams)
socket.on('update_events', input => {
    events = input;
    console.log(events);
    renderEvents(events)
})
function renderEvents(events) {
    const eventsContainer = document.querySelector('div.events-content')
    eventsContainer.querySelectorAll('div.event-list-event').forEach(event => { event.parentNode.removeChild(event) })
    events.forEach(event => {
        const newEvent = document.createElement('div')
        newEvent.classList.add('event-list-event')
        newEvent.setAttribute('id', event._id)
        const startTime = new Date(event.startTime).toLocaleString('es-ES', {
            dateStyle: 'short', // full, long, medium, short
            timeStyle: 'short'
        });
        const endTime = new Date(event.endTime).toLocaleString('es-ES', {
            dateStyle: 'short', // full, long, medium, short
            timeStyle: 'short'
        });

        if (event.type === 'notAvailable') {
            if (event.asset.type === 'instructor') {
                newEvent.innerHTML = `<div class="name"><span>${event.type}</span></div>
            <div class="role"><span>${startTime}</span></div>
            <div class="email"><span>${endTime}</span></div>
            <div><span>${event.asset.name}</span></div>
            <div><span>-</span></div>
            <div><span>-</span></div>
            <div><span>-</span></div>
            <div><span>-</span></div>
            <div class="manage-icons"><a href="#" class="edit-event">Edit</a><span> | </span><a href="#" class="delete-event">Delete</a></div>
                `;
            } else if (event.asset.type === 'student') {
                newEvent.innerHTML = `<div class="name"><span>${event.type}</span></div>
            <div class="role"><span>${startTime}</span></div>
            <div class="email"><span>${endTime}</span></div>
            <div><span>-</span></div>
            <div><span>${event.asset.name}</span></div>
            <div><span>-</span></div>
            <div><span>-</span></div>
            <div><span>-</span></div>
            <div class="manage-icons"><a href="#" class="edit-event">Edit</a><span> | </span><a href="#" class="delete-event">Delete</a></div>
                `;
            } else if (event.asset.type === 'aircraft') {
                newEvent.innerHTML = `<div class="name"><span>${event.type}</span></div>
            <div class="role"><span>${startTime}</span></div>
            <div class="email"><span>${endTime}</span></div>
            <div><span>-</span></div>
            <div><span>-</span></div>
            <div><span>${event.asset.name}</span></div>
            <div><span>-</span></div>
            <div><span>-</span></div>
            <div class="manage-icons"><a href="#" class="edit-event">Edit</a><span> | </span><a href="#" class="delete-event">Delete</a></div>
                `;
            } else if (event.asset.type === 'subject') {
                newEvent.innerHTML = `<div class="name"><span>${event.type}</span></div>
            <div class="role"><span>${startTime}</span></div>
            <div class="email"><span>${endTime}</span></div>
            <div><span>-</span></div>
            <div><span>-</span></div>
            <div><span>-</span></div>
            <div><span>${event.asset.name}</span></div>
            <div><span>-</span></div>
            <div class="manage-icons"><a href="#" class="edit-event">Edit</a><span> | </span><a href="#" class="delete-event">Delete</a></div>
                `;
            } else if (event.asset.type === 'room') {
                newEvent.innerHTML = `<div class="name"><span>${event.type}</span></div>
            <div class="role"><span>${startTime}</span></div>
            <div class="email"><span>${endTime}</span></div>
            <div><span>-</span></div>
            <div><span>-</span></div>
            <div><span>-</span></div>
            <div><span>-</span></div>
            <div><span>${event.asset.name}</span></div>
            <div class="manage-icons"><a href="#" class="edit-event">Edit</a><span> | </span><a href="#" class="delete-event">Delete</a></div>
                `;
            }
        } else if (event.type === 'flight') {
            newEvent.innerHTML = `<div class="name"><span>${event.type}</span></div>
            <div class="role"><span>${startTime}</span></div>
            <div class="email"><span>${endTime}</span></div>
            <div><span>${event.instructor}</span></div>
            <div><span>${event.student}</span></div>
            <div><span>${event.aircraft}</span></div>
            <div><span>-</span></div>
            <div><span>-</span></div>
            <div class="manage-icons"><a href="#" class="edit-event">Edit</a><span> | </span><a href="#" class="delete-event">Delete</a></div>
            `;
        } else if (event.type === 'class' || event.type === 'exam') {
            newEvent.innerHTML = `<div class="name"><span>${event.type}</span></div>
            <div class="role"><span>${startTime}</span></div>
            <div class="email"><span>${endTime}</span></div>
            <div><span>${event.instructor}</span></div>
            <div><span>${event.student}</span></div>
            <div><span>-</span></div>
            <div><span>${event.subject}</span></div>
            <div><span>${event.room}</span></div>
            <div class="manage-icons"><a href="#" class="edit-event">Edit</a><span> | </span><a href="#" class="delete-event">Delete</a></div>
            `;
        }
        eventsContainer.appendChild(newEvent)
        const currentEvent = document.getElementById(event._id)
        const manageCurrentEvent = currentEvent.querySelector('.manage-icons')
        const editCurrentEvent = manageCurrentEvent.querySelector('.edit-event')
        const deleteCurrentEvent = manageCurrentEvent.querySelector('.delete-event')
        calendarParams.clientDate = new Date()
        const outputEvent = {
            _id: event._id,
            clientDate: calendarParams.clientDate,
            weekStartDay: calendarParams.weekStartDay
        }
        editCurrentEvent.addEventListener('click', editEvent.bind(outputEvent))
        deleteCurrentEvent.addEventListener('click', deleteEvent.bind(outputEvent))
    });
    closeAddEvent();
}