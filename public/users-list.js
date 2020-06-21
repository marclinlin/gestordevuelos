const socket = io.connect('http://localhost:3000/');
socket.on('message', msg => { console.log(msg); })

const monthNamesShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']


// ADD USER
function openAddUser() {
    document.getElementById('new-user-overlay').style.display = 'block'
    addUserButton.removeEventListener('click', openAddUser)
    addUserButton.addEventListener('click', closeAddUser)
}
function closeAddUser() {
    document.getElementById('new-user-overlay').style.display = 'none'
    addUserButton.removeEventListener('click', closeAddUser)
    addUserButton.addEventListener('click', openAddUser)
}
const addUserButton = document.getElementById('new-user-button')
addUserButton.addEventListener('click', openAddUser)
const addUserForm = document.getElementById('new-user-form')
addUserForm.addEventListener('submit', e => {
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
    socket.emit('new_user', output)
})
const closeAddUserButton = document.querySelector('.close-addUser')
closeAddUserButton.addEventListener('click', closeAddUser)

// EDIT/DELETE USER
function editUser() {
    let id = this.id;
    let _id = this._id;
    document.getElementById(id).querySelectorAll('div').forEach(field => {
        function saveUserFunction() {
            const outputUser = {}
            document.getElementById(this).querySelectorAll('div').forEach(field => {
                field.firstElementChild.setAttribute('contenteditable', false)
                const className = field.classList[0];
                if (field.className !== 'manage-icons' && field.className !== 'last-connection' && field.className !== 'role') {
                    if (field.className === 'id') {
                        outputUser['id'] = field.firstElementChild.innerHTML
                    } else {
                        outputUser[className] = field.firstElementChild.innerHTML
                    }
                } else if (field.className === 'role') {
                    const newRole = field.firstElementChild.elements.role.value
                    outputUser['role'] = newRole
                    field.querySelectorAll('form').forEach(form => { form.parentNode.removeChild(form) })
                    field.innerHTML = `<span>${newRole}</span>`
                }
            })
            const saveUserButton = field.querySelector('.save-user')
            saveUserButton.parentNode.removeChild(saveUserButton)
            const editUserButton = document.createElement('a')
            editUserButton.setAttribute('href', '#')
            editUserButton.classList.add('edit-user')
            editUserButton.innerHTML = 'Edit'
            const currentSeparator = document.getElementById(id).querySelector('.manage-icons').querySelectorAll('span')[0]
            field.insertBefore(editUserButton, currentSeparator)
            field.querySelector('.edit-user').addEventListener('click', editUser.bind(id));
            outputUser['_id'] = _id
            socket.emit('edit_user', outputUser)
            console.log(`Saving user ${id}:`);
            console.log(outputUser);
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
            const editUserButton = field.querySelector('.edit-user')
            editUserButton.parentNode.removeChild(editUserButton)
            const saveUserButton = document.createElement('a')
            saveUserButton.setAttribute('href', '#')
            saveUserButton.classList.add('save-user')
            saveUserButton.innerHTML = 'Save'
            const currentSeparator = document.getElementById(id).querySelector('.manage-icons').querySelectorAll('span')[0]
            field.insertBefore(saveUserButton, currentSeparator)
            field.querySelector('.save-user').addEventListener('click', saveUserFunction.bind(id));
        } else if (field.classList.contains('last-connection')) {
            // 
        } else if (field.classList.contains('role')) {
            const currentRole = field.firstElementChild.innerHTML
            field.querySelectorAll('span').forEach(element => element.parentNode.removeChild(element))
            const adminInnerHTML = `
            <form>
            <select id="role">
            <option selected>admin</option>
            <option>instructor</option>
            <option>student</option>
            </select>
            </form>`
            const instructorInnerHTML = `
            <form>
            <select id="role">
            <option>admin</option>
            <option selected>instructor</option>
            <option>student</option>
            </select>
            </form>`
            const studentInnerHTML = `
            <form>
            <select id="role">
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
    console.log(`Editing user ${id}`);
}
function deleteUser() {
    socket.emit('delete_user', this)
    console.log(`Deleting user ${this.id}`);
}

// INIT PAGE
socket.emit('get_users')
socket.on('users_list', input => {
    users = input;
    renderUsers(users)
})
function renderUsers(users) {
    const usersContainer = document.querySelector('div.users-content')
    usersContainer.querySelectorAll('div.user').forEach(user => { user.parentNode.removeChild(user) })
    users.forEach(user => {
        const newUser = document.createElement('div')
        newUser.classList.add('user')
        newUser.setAttribute('id', user.id)
        newUser.setAttribute('data-_id', user._id)
        let date = undefined;
        if (!!user.lastConnection) {
            date = `${user.lastConnection.getDate()} ${monthNamesShort[user.lastConnection.getMonth()]} ${user.lastConnection.getHours()}:${user.lastConnection.getMinutes()}`
            newUser.innerHTML = `<div class="id"><span>${user.id}</span></div>
            <div class="name"><span>${user.name}</span></div>
            <div class="role"><span>${user.role}</span></div>
            <div class="email"><span>${user.email}</span></div>
            <div class="last-connection"><span>${date}</span></div>
            <div class="manage-icons"><a href="#" class="edit-user">Edit</a><span> | </span><a href="#" class="delete-user">Delete</a></div>
            `;
        } else {
            newUser.innerHTML = `<div class="id"><span>${user.id}</span></div>
            <div class="name"><span>${user.name}</span></div>
            <div class="role"><span>${user.role}</span></div>
            <div class="email"><span>${user.email}</span></div>
            <div class="last-connection"><span>Never</span></div>
            <div class="manage-icons"><a href="#" class="edit-user">Edit</a><span> | </span><a href="#" class="delete-user">Delete</a></div>
            `;
        }
        usersContainer.appendChild(newUser)
        const currentUser = document.getElementById(user.id)
        const manageCurrentUser = currentUser.querySelector('.manage-icons')
        const editCurrentUser = manageCurrentUser.querySelector('.edit-user')
        const deleteCurrentUser = manageCurrentUser.querySelector('.delete-user')
        const bindedObject = {
            _id: user._id,
            id: user.id
        }
        editCurrentUser.addEventListener('click', editUser.bind(bindedObject))
        deleteCurrentUser.addEventListener('click', deleteUser.bind(bindedObject))
    });
    closeAddUser();
}