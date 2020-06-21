const socket = io.connect('http://localhost:3000/');
socket.on('message', msg => { console.log(msg); })

const monthNamesShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']



// ADD AIRCRAFT
function openAddAircraft() {
    document.getElementById('new-aircraft-overlay').style.display = 'block'
    addAircraftButton.removeEventListener('click', openAddAircraft)
    addAircraftButton.addEventListener('click', closeAddAircraft)
}
function closeAddAircraft() {
    document.getElementById('new-aircraft-overlay').style.display = 'none'
    addAircraftButton.removeEventListener('click', closeAddAircraft)
    addAircraftButton.addEventListener('click', openAddAircraft)
}
const addAircraftButton = document.getElementById('new-aircraft-button')
addAircraftButton.addEventListener('click', openAddAircraft)
const addAircraftForm = document.getElementById('new-aircraft-form')
addAircraftForm.addEventListener('submit', e => {
    e.preventDefault();
    console.log(e.target.elements);

    const name = e.target.elements.name.value

    const output = {
        name
    }
    console.log(output);
    socket.emit('new_aicraft', output)
})
/* const closeAddAircraftButton = document.querySelector('.close-addAircraft')
closeAddAircraftButton.addEventListener('click', closeAddAircraft) */




// EDIT/DELETE AIRCRAFT
function editAircraft() {
    let _id = this._id;
    document.getElementById(_id).querySelectorAll('div').forEach(field => {
        function saveAircraftFunction() {
            const outputAircraft = {}
            document.getElementById(this).querySelectorAll('div').forEach(field => {
                field.firstElementChild.setAttribute('contenteditable', false)
                const className = field.classList[0];
                if (field.className !== 'manage-icons') {
                    if (field.className === 'id') {
                        outputAircraft['id'] = field.firstElementChild.innerHTML
                    } else {
                        outputAircraft[className] = field.firstElementChild.innerHTML
                    }
                }
            })
            const saveAircraftButton = field.querySelector('.save-aircraft')
            saveAircraftButton.parentNode.removeChild(saveAircraftButton)
            const editAircraftButton = document.createElement('a')
            editAircraftButton.setAttribute('href', '#')
            editAircraftButton.classList.add('edit-aircraft')
            editAircraftButton.innerHTML = 'Edit'
            const currentSeparator = document.getElementById(id).querySelector('.manage-icons').querySelectorAll('span')[0]
            field.insertBefore(editAircraftButton, currentSeparator)
            field.querySelector('.edit-aircraft').addEventListener('click', editAircraft.bind(id));
            outputAircraft['_id'] = _id
            socket.emit('edit_aircraft', outputAircraft)
            console.log(`Saving aircraft ${id}:`);
            console.log(outputAircraft);
        }
        function preventLineBreak(e) {
            if (e.keyCode == 13) { // KEY ENTER
                e.preventDefault();
            }
        }
        if (!field.classList.contains('manage-icons')) {
            field.firstChild.setAttribute('contenteditable', true)
            field.addEventListener('keydown', preventLineBreak)
        } else if (field.classList.contains('manage-icons')) {
            const editAircraftButton = field.querySelector('.edit-aircraft')
            editAircraftButton.parentNode.removeChild(editAircraftButton)
            const saveAircraftButton = document.createElement('a')
            saveAircraftButton.setAttribute('href', '#')
            saveAircraftButton.classList.add('save-aircraft')
            saveAircraftButton.innerHTML = 'Save'
            const currentSeparator = document.getElementById(id).querySelector('.manage-icons').querySelectorAll('span')[0]
            field.insertBefore(saveAircraftButton, currentSeparator)
            field.querySelector('.save-aircraft').addEventListener('click', saveAircraftFunction.bind(id));
        }
    })
    console.log(`Editing aircraft ${id}`);
}
function deleteAircraft() {
    socket.emit('delete_aircraft', this)
    console.log(`Deleting aircraft ${this.id}`);
}

// INIT PAGE
socket.emit('get_aircraft')
socket.on('aircraft_list', input => {
    aircraftList = input;
    renderAircraft(aircraftList)
})
function renderAircraft(aircraftList) {
    const aircraftContainer = document.querySelector('div.aircraft-content')
    aircraftContainer.querySelectorAll('div.aircraft').forEach(aircraft => { aircraft.parentNode.removeChild(aircraft) })
    aircraftList.forEach(aircraft => {
        const newAircraft = document.createElement('div')
        newAircraft.classList.add('aircraft')
        newAircraft.setAttribute('id', aircraft._id)
        newAircraft.innerHTML = `<div class="id"><span>${aircraft.id}</span></div>
        <div class="name"><span>${aircraft.name}</span></div>
        <div class="manage-icons"><a href="#" class="edit-aircraft">Edit</a><span> | </span><a href="#" class="delete-aircraft">Delete</a></div>
        `;
        aircraftContainer.appendChild(newAircraft)
        const currentAircraft = document.getElementById(aircraft._id)
        const manageCurrentAircraft = currentAircraft.querySelector('.manage-icons')
        const editCurrentAircraft = manageCurrentAircraft.querySelector('.edit-aircraft')
        const deleteCurrentAircraft = manageCurrentAircraft.querySelector('.delete-aircraft')
        const bindedObject = {
            _id: aircraft._id,
        }
        editCurrentAircraft.addEventListener('click', editAircraft.bind(bindedObject))
        deleteCurrentAircraft.addEventListener('click', deleteAircraft.bind(bindedObject))
    });
    closeAddAircraft();
}
socket.on('aircraft_list', input => {
    aircraft = input;
    renderAircraft(aircraft)
})