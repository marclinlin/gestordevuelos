const socket = io.connect('http://localhost:3000/');
socket.on('message', msg => { console.log(msg); })

const monthNamesShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const calendarParams = {
    clientDate: new Date(),
    weekStartDay: 'Monday'
}

// ADD EVENT
function openAddEvent() {
    document.getElementById('new-event-overlay').style.display = 'block'
    addEventButton.removeEventListener('click', openAddEvent)
}
function closeAddEvent() {
    document.getElementById('new-event-overlay').style.display = 'none'
    addEventButton.addEventListener('click', openAddEvent)
}
const addEventButton = document.querySelector('.new-event-button')
addEventButton.addEventListener('click', openAddEvent)
const addEventForm = document.getElementById('new-event-form')
addEventForm.addEventListener('submit', e => {
    e.preventDefault();
    console.log(e.target.elements);

    const id = e.target.elements.id.value
    const name = e.target.elements.name.value
    const role = e.target.elements.role.value
    const email = e.target.elements.email.value

    const output = {
        id,
        name,
        role,
        email
    }
    console.log(output);
    socket.emit('new_event', output)
})
const closeAddEventButton = document.querySelector('.close-addEvent')
closeAddEventButton.addEventListener('click', closeAddEvent)

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